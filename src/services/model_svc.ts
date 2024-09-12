import { Prisma } from "@prisma/client"
import db from "../adapter.ts/database"

interface modelPayload {
	id?: number,
	name: string,
	created_by: number
}

export const ModelSvc = {
	getAllModel: async (limit: number, page: number, search: string) => {
		let whereCondition: Prisma.modelsWhereInput = {
			deleted_at: null
		}

		if(search){
			whereCondition.AND = [
				{
					OR: [
						{ name: { contains: search } }
					]
				}
			]
		}
		const total_brand = await db.models.count({ where: whereCondition });
		const totalPages = Math.ceil(total_brand / limit);
		const offset = (page - 1) * limit;
		const models = await db.models.findMany({
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
			total_rows: total_brand,
			data: models
		}
	},

	getAllModelOption: async () => {
		const models = await db.models.findMany({
			where: {
				deleted_at: null
			}
		});
		return models
	},

	getModelByID: async (id: number) => {
        const model = await db.models.findUnique({
            where: {
                id: id
            }
        });
        return model;
    },

	createModel: async (payload: modelPayload) => {
		const model = await db.models.create({
			data: {
				name: payload.name,
				created_by: payload.created_by
			}
		});
		return model;
	},

	updateModel: async (id: number, payload: modelPayload) => {
		const model = await db.models.update({
			where: {
				id: id
			},
			data: {
				name: payload.name
			}
		});
		return model;
	},

	softDeleteModel: async (id: number) => {
        const model = await db.models.update({
            where: {
                id: id,
            },
            data: {
                deleted_at: new Date(),
            }
        });
        return model;
    }
}