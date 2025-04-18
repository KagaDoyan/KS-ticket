import { Prisma, item_status, item_type, item_types } from "@prisma/client"
import db from "../adapter.ts/database"
import { DataNotFoundError } from "../exception/DataNotFound"

interface itemPayload {
	id?: number,
	serial_number: string,
	category_id: number,
	customer_id?: number,
	brand_id: number,
	model_id: number,
	warranty_expiry_date?: any,
	inc_number?: string,
	status: item_status,
	type?: item_type,
	created_by: number,
	engineer_id: number | null,
	storage_id: number,
	remark?: string
	condition?: string,
	item_type?: item_types,
	reuse?: boolean
}

export const itemSvc = {
	getAllItem: async (limit: number, page: number, search: string, category: number, location: string, condition: string, type: item_types, status: item_status) => {
		let whereCondition: Prisma.itemsWhereInput = {
			deleted_at: null
		}
		whereCondition.AND = []

		if (search) {
			whereCondition.AND = [
				{
					OR: [
						{ serial_number: { contains: search } },
						{ inc_number: { contains: search } },
						{ brand: { name: { contains: search } } },
						{ model: { name: { contains: search } } },
						{ category: { name: { contains: search } } },
						{ customer: { fullname: { contains: search } } },
						{ engineer: { name: { contains: search } } },
						{ engineer: { node: { name: { contains: search } } } },
						{ storage: { name: { contains: search } } },
						{ Remark: { contains: search } },
						{ condition: { contains: search } },
					]
				}
			]
		}
		if (category) {
			whereCondition.AND.push({
				category_id: category
			})
		}
		if (location) {
			const [filterType, filterValue] = location.toString().split(':');

			if (filterType && filterValue) {
				switch (filterType.toLowerCase()) {
					case 'engineer':
						whereCondition.AND.push({
							engineer: {
								OR: [
									{
										name: {
											contains: filterValue
										}
									},
									{
										node: {
											name: {
												contains: filterValue
											}
										}
									}
								]
							}
						});
						break;
					case 'shop':
						whereCondition.AND.push({
							shop_number: {
								contains: filterValue
							}
						});
						break;
					case 'storage':
						whereCondition.AND.push({
							storage: {
								name: {
									contains: filterValue
								}
							}
						});
						break;
					default:
						// Fallback to original behavior if no specific type is matched
						whereCondition.AND.push({
							OR: [
								{
									storage: {
										name: {
											contains: location.toString()
										}
									}
								},
								{
									shop_number: {
										contains: location.toString()
									}
								}
							]
						});
				}
			} else {
				// Original behavior if no separator is found
				whereCondition.AND.push({
					OR: [
						{
							storage: {
								name: {
									contains: location.toString()
								}
							}
						},
						{
							shop_number: {
								contains: location.toString()
							}
						}
					]
				});
			}
		}

		if (condition) {
			whereCondition.AND.push({
				condition: condition
			})
		}
		if (type) {
			whereCondition.AND.push({
				item_type: type
			})
		}
		if (status) {
			whereCondition.AND.push({
				status: status
			})
		}

		const total_item = await db.items.count({ where: whereCondition });
		const totalPages = Math.ceil(total_item / limit);
		const offset = (page - 1) * limit;
		const items = await db.items.findMany({
			where: whereCondition,
			skip: offset,
			take: limit,
			orderBy: {
				id: "desc"
			},
			include: {
				category: true,
				brand: true,
				model: true,
				engineer: {
					include: {
						node: true
					}
				},
				storage: true
			}
		});
		return {
			page: page,
			limit: limit,
			total_page: totalPages,
			total_rows: total_item,
			data: items
		}
	},

	getItemByID: async (id: number) => {
		const item = await db.items.findUnique({
			where: {
				id: id
			}
		});
		return item;
	},

	createItem: async (payload: itemPayload) => {
		const item = await db.items.create({
			data: {
				serial_number: payload.serial_number,
				category_id: payload.category_id,
				brand_id: payload.brand_id,
				model_id: payload.model_id,
				customer_id: payload.customer_id || null,
				warranty_expiry_date: payload.warranty_expiry_date,
				status: payload.status,
				created_by: payload.created_by,
				storage_id: payload.storage_id,
				item_type: payload.item_type,
				reuse: payload.reuse,
				Remark: payload.remark,
				condition: payload.condition
			}
		});
		return item;
	},

	updateItem: async (id: number, payload: itemPayload) => {
		const item = await db.items.update({
			where: {
				id: id
			},
			data: {
				serial_number: payload.serial_number,
				category_id: payload.category_id,
				brand_id: payload.brand_id,
				customer_id: payload.customer_id || null,
				model_id: payload.model_id,
				warranty_expiry_date: payload.warranty_expiry_date || null,
				status: payload.status,
				storage_id: payload.storage_id,
				Remark: payload.remark,
				condition: payload.condition,
				updated_at: new Date(),
				item_type: payload.item_type,
				reuse: payload.reuse
			}
		});
		return item;
	},

	updateEngineerItem: async (id: number, payload: itemPayload) => {
		const item = await db.items.update({
			where: {
				id: id
			},
			data: {
				engineers_id: payload.engineer_id,
				storage_id: payload.storage_id,
			}
		});
		return item;
	},

	softDeleteItem: async (id: number) => {
		const item = await db.items.update({
			where: {
				id: id,
			},
			data: {
				deleted_at: new Date(),
			}
		});
		return item;
	},

	itemStatusOption: async () => {
		const option = await Object.values(item_status);
		return option
	},

	getItemBySerialNumber: async (serial_number: string) => {
		const item = await db.items.findFirst({
			where: {
				serial_number: serial_number,
				deleted_at: null
			},
			include: {
				brand: true,
				category: true,
				model: true
			}
		});
		if (!item) {
			throw new DataNotFoundError()
		}
		return item
	}
}