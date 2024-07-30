import { Prisma, item_status, item_type } from "@prisma/client"
import db from "../adapter.ts/database"

interface itemPayload {
	id?: number,
	serial_number: string,
	category_id: number,
	brand_id: number,
	model_id: number,
	warranty_expiry_date?: any,
	inc_number: string,
	status: item_status,
	type: item_type,
	created_by: number
}

export const itemSvc = {
	getAllItem: async (limit: number, page: number, search: string) => {
		let whereCondition: Prisma.itemsWhereInput = {
			deleted_at: null
		}

		if(search){
			whereCondition.AND = [
				{
					OR: [
						{ serial_number: { contains: search } }
					]
				}
			]
		}
		const total_item = await db.items.count({ where: whereCondition });
		const totalPages = Math.ceil(total_item / limit);
		const offset = (page - 1) * limit;
		const items = await db.items.findMany({
			where: whereCondition,
			skip: offset,
			take: limit,
			include:{
				category: true,
				brand: true,
				model: true,
				engineer: true
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
				warranty_expiry_date: payload.warranty_expiry_date,
				inc_number: payload.inc_number,
				status: payload.status,
				type: payload.type,
				created_by: payload.created_by,
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
				model_id: payload.model_id,
				warranty_expiry_date: payload.warranty_expiry_date,
				inc_number: payload.inc_number,
				status: payload.status,
				type: payload.type
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
	}
}