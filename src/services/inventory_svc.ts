import { Prisma } from "@prisma/client"
import db from "../adapter.ts/database"

interface inventoryPayload {
	id?: number,
	model?: string,
	serial?: string,
	warranty?: string,
	sell_date?: string,
	buyer_name?: string,
	created_by: number
}

export const InventorySvc = {
	getAllInventory: async (limit: number, page: number, search: string) => {
		let whereCondition: Prisma.inventoryWhereInput = {
			deleted_at: null
		}

		if(search){
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
				warranty: payload.warranty,
				sell_date: payload.sell_date,
				buyer_name: payload.buyer_name,
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
				warranty: payload.warranty,
				sell_date: payload.sell_date,
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
}