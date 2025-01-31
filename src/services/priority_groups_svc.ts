import { Prisma } from "@prisma/client"
import db from "../adapter.ts/database"

interface priorityGroupPayload {
	id?: number,
	group_name: string,
	customer_id: number,
	province_id: number[],
	created_by: number
}

export const PriorityGroupSvc = {
	getAllPriorityGroup: async (limit: number, page: number, search: string, customer_id: string) => {
		let whereCondition: Prisma.priority_groupsWhereInput = {
			deleted_at: null
		}
		whereCondition.AND = []

		if (search) {
			whereCondition.AND.push(
				{
					OR: [
						{ group_name: { contains: search } }
					]
				}
			)
		}
		if (customer_id) {
			whereCondition.AND.push(
				{
					customers_id: Number(customer_id)
				}
			)
		}
		const total_priority_group = await db.priority_groups.count({ where: whereCondition });
		const totalPages = Math.ceil(total_priority_group / limit);
		const offset = (page - 1) * limit;
		const priorityGroups = await db.priority_groups.findMany({
			where: whereCondition,
			skip: offset,
			take: limit,
			orderBy: {
				id: "desc"
			},
			include: {
				priorities: {
					where: {
						deleted_at: null
					}
				},
				customer: true,
				provinces: true
			}
		});
		return {
			page: page,
			limit: limit,
			total_page: totalPages,
			total_rows: total_priority_group,
			data: priorityGroups
		}
	},

	getAllPriorityGroupOptions: async () => {
		const priorityGroups = await db.priority_groups.findMany({
			where: {
				deleted_at: null
			},
		});
		return priorityGroups
	},

	getPriorityGroupByID: async (id: number) => {
		const priorityGroup = await db.priority_groups.findUnique({
			where: {
				id: id
			},
			include: {
				priorities: {
					where: {
						deleted_at: null
					}
				},
				customer: true,
				provinces: true
			}
		});
		return priorityGroup;
	},

	createPriorityGroup: async (payload: priorityGroupPayload) => {
		const priorityGroup = await db.priority_groups.create({
			data: {
				group_name: payload.group_name,
				customers_id: payload.customer_id,
				provinces: {
					connect: payload.province_id.map(id => ({ id }))
				},
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
				customers_id: payload.customer_id,
				provinces: {
					set: payload.province_id.map(id => ({ id }))
				},
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
	},

	findPriorityGroupByCustomerAndProvince: async (customer_id: number, province_id: number) => {
		const priority_groups = await db.priority_groups.findMany({
			where: {
				customers_id: customer_id,
				provinces: {
					some: {
						id: province_id
					}
				},
				deleted_at: null,
			},
			include: {
				priorities: {
					where: {
						deleted_at: null,
					}
				}
			}
		})
		var priorities: {
			id: number
			group_name: string
			name: string
			time_sec: number
		}[] = []
		priority_groups.forEach((priority_group) => {
			priority_group.priorities.forEach((priority) => {
				priorities.push({ id: priority.id, group_name: priority_group.group_name, name: priority.name, time_sec: parseInt(priority.time_sec) })
			})
		})
		return priorities
	}
}