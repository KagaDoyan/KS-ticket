import { Prisma, item_status } from "@prisma/client"
import db from "../adapter.ts/database"

interface itemPayload {
	id?: number,
	sn: string,
	category_id: number,
	brand_id: number,
	model_id: number,
	insure_exp_date?: any,
	inc_num: string,
	status: item_status,
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
						{ sn: { contains: search } }
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
			take: limit
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
				sn: payload.sn,
                category_id: payload.category_id,
                brand_id: payload.brand_id,
                model_id: payload.model_id,
                insure_exp_date: payload.insure_exp_date,
                inc_num: payload.inc_num,
                status: payload.status,
				created_by: payload.created_by
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
				sn: payload.sn,
                category_id: payload.category_id,
                brand_id: payload.brand_id,
                model_id: payload.model_id,
                insure_exp_date: payload.insure_exp_date,
                inc_num: payload.inc_num,
                status: payload.status,
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
    }
}