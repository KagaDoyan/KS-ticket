import { Prisma } from "@prisma/client"
import db from "../adapter.ts/database"

interface priorityGroupPayload {
	id?: number,
	group_name: string,
	created_by: number
}

export const PriorityGroupSvc = {
	getAllPriorityGroup: async (limit: number, page: number, search: string) => {
		let whereCondition: Prisma.priority_groupsWhereInput = {
			deleted_at: null
		}

		if(search){
			whereCondition.AND = [
				{
					OR: [
						{ group_name: { contains: search } }
					]
				}
			]
		}
		const total_priority_group = await db.priority_groups.count({ where: whereCondition });
		const totalPages = Math.ceil(total_priority_group / limit);
		const offset = (page - 1) * limit;
		const priorityGroups = await db.priority_groups.findMany({
			where: whereCondition,
			skip: offset,
			take: limit
		});
		return {
			page: page,
            limit: limit,
            total_page: totalPages,
            total_rows: total_priority_group,
            data: priorityGroups
		}
	},

	getPriorityGroupByID: async (id: number) => {
        const priorityGroup = await db.priority_groups.findUnique({
            where: {
                id: id
            }
        });
        return priorityGroup;
    },

	createPriorityGroup: async (payload: priorityGroupPayload) => {
		const priorityGroup = await db.priority_groups.create({
			data: {
				group_name: payload.group_name,
				created_by: payload.created_by
			}
		});
		return priorityGroup;
	},

	updatePriorityGroup: async (id: number, payload: priorityGroupPayload) => {
		const priorityGroup = await db.priority_groups.update({
			where: {
				id: id
			},
			data: {
				group_name: payload.group_name,
			}
		});
		return priorityGroup;
	},

	softDeletePriorityGroup: async (id: number) => {
        const priorityGroup = await db.priority_groups.update({
            where: {
                id: id,
            },
            data: {
                deleted_at: new Date(),
            }
        });
        return priorityGroup;
    }
}