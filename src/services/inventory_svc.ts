import { Prisma } from "@prisma/client"
import db from "../adapter.ts/database"
import { report } from "node:process"

interface inventoryPayload {
	id?: number,
	model?: string,
	brand?: string,
	serial?: string,
	warranty?: string,
	sell_date: string,
	buyer_name?: string,
	sell_price?: number,
	created_by: number
}

export const InventorySvc = {
	getAllInventory: async (limit: number, page: number, search: string) => {
		let whereCondition: Prisma.inventoryWhereInput = {
			deleted_at: null
		}

		if (search) {
			whereCondition.AND = [
				{
					OR: [
						{
							model: { contains: search },
							serial: { contains: search },
							buyer_name: { contains: search }
						}
					]
				}
			]
		}
		const total_inventory = await db.inventory.count({ where: whereCondition });
		const totalPages = Math.ceil(total_inventory / limit);
		const offset = (page - 1) * limit;
		const inventories = await db.inventory.findMany({
			where: whereCondition,
			skip: offset,
			take: limit,
			orderBy: {
				id: "desc"
			}
		});
		return {
			page: page,
			limit: limit,
			total_page: totalPages,
			total_rows: total_inventory,
			data: inventories
		}
	},

	getInventoryByID: async (id: number) => {
		const inventory = await db.inventory.findUnique({
			where: {
				id: id
			}
		});
		return inventory;
	},

	createInventory: async (payload: inventoryPayload) => {
		const inventory = await db.inventory.create({
			data: {
				model: payload.model,
				serial: payload.serial,
				brand: payload.brand,
				warranty: payload.warranty,
				sell_date: payload.sell_date,
				buyer_name: payload.buyer_name,
				sell_price: payload.sell_price,
				created_by: payload.created_by
			}
		});
		return inventory;
	},

	updateInventory: async (id: number, payload: inventoryPayload) => {
		const inventory = await db.inventory.update({
			where: {
				id: id
			},
			data: {
				model: payload.model,
				serial: payload.serial,
				brand: payload.brand,
				warranty: payload.warranty,
				sell_date: payload.sell_date,
				sell_price: payload.sell_price,
				buyer_name: payload.buyer_name,
			}
		});
		return inventory;
	},

	softDeleteInventory: async (id: number) => {
		const inventory = await db.inventory.update({
			where: {
				id: id,
			},
			data: {
				deleted_at: new Date(),
			}
		});
		return inventory;
	},

	reportInventory: async (form: string, to: string, search: string) => {
		let whereCondition: Prisma.inventoryWhereInput = {
			sell_date: {
				gte: form,
				lte: to
			}
		}
		if (search) {
			whereCondition.AND = [
				{
					OR: [
						{
							model: { contains: search },
						},
						{
							brand: { contains: search },
						},
						{
							serial: { contains: search },
						},
						{
							buyer_name: { contains: search }
						}
					]
				}
			]
		}
		const inventory = await db.inventory.findMany({
			where: whereCondition,
			select: {
				model: true,
				brand: true,
				serial: true,
				sell_date: true,
				sell_price: true,
				buyer_name: true,
				warranty: true,
			}
		});
		return inventory;
	}
}