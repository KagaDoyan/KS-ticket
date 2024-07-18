import { Prisma } from "@prisma/client"
import db from "../adapter.ts/database"

interface priorityPayload {
	id?: number,
	name: string,
	time_sec: string,
	created_by: number
}

export const PrioritySvc = {
	getAllPriority: async (limit: number, page: number, search: string) => {
		let whereCondition: Prisma.prioritiesWhereInput = {
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
		const total_priority = await db.priorities.count({ where: whereCondition });
		const totalPages = Math.ceil(total_priority / limit);
		const offset = (page - 1) * limit;
		const priorities = await db.priorities.findMany({
			where: whereCondition,
			skip: offset,
			take: limit
		});
		return {
			page: page,
            limit: limit,
            total_page: totalPages,
            total_rows: total_priority,
            data: priorities
		}
	},

	getPriorityByID: async (id: number) => {
        const priority = await db.priorities.findUnique({
            where: {
                id: id
            }
        });
        return priority;
    },

	createPriority: async (payload: priorityPayload) => {
		const priority = await db.priorities.create({
			data: {
				name: payload.name,
                time_sec: payload.time_sec,
				created_by: payload.created_by
			}
		});
		return priority;
	},

	updatePriority: async (id: number, payload: priorityPayload) => {
		const priority = await db.priorities.update({
			where: {
				id: id
			},
			data: {
				name: payload.name,
                time_sec: payload.time_sec,
			}
		});
		return priority;
	},

	softDeletePriority: async (id: number) => {
        const priority = await db.priorities.update({
            where: {
                id: id,
            },
            data: {
                deleted_at: new Date(),
            }
        });
        return priority;
    }
}