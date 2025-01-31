import { Prisma } from "@prisma/client";
import db from "../adapter.ts/database";
interface teamPayload {
    id?: number
    team_name: string
    customers_id?: number
}
export const TeamSvc = {
    async getTeams(limit: number, page: number, search?: string, customer_id?: string) {
        let whereCondition: Prisma.teamsWhereInput = {}

        whereCondition.AND = []

        if (search) {
            whereCondition.AND.push(
                {
                    OR: [
                        { team_name: { contains: search } }
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
        const total_storage = await db.teams.count({ where: whereCondition })
        const totalPages = Math.ceil(total_storage / limit);
        const offset = (page - 1) * limit;
        const teams = await db.teams.findMany({
            where: whereCondition,
            skip: offset,
            take: limit,
            orderBy: {
                id: "desc"
            },
            include: {
                customer: true
            }
        });
        return {
            page: page,
            limit: limit,
            total_page: totalPages,
            total_rows: total_storage,
            data: teams
        }
    },
    async getTeam(id: number) {
        const team = await db.teams.findUnique({
            where: {
                id: id
            },
            include: {
                customer: true
            }
        });
        return team
    },
    async createTeam(payload: teamPayload) {
        const team = await db.teams.create({
            data: {
                team_name: payload.team_name,
                customers_id: payload.customers_id
            }
        });
        return team
    },
    async updateTeam(id: number, payload: teamPayload) {
        const team = await db.teams.update({
            where: {
                id: id
            },
            data: {
                team_name: payload.team_name,
                customers_id: payload.customers_id
            }
        });
        return team
    },
    async deleteTeam(id: number) {
        const team = await db.teams.delete({
            where: {
                id: id
            }
        });
        return team
    },

    async getTeamOption(customer_id?: number) {
        const whereCondition: Prisma.teamsWhereInput = {}
        if (customer_id) {
            whereCondition.AND = [
                {
                    customers_id: Number(customer_id)
                }
            ]
        }
        const teams = await db.teams.findMany({
            where: whereCondition
        });
        return teams
    }
}