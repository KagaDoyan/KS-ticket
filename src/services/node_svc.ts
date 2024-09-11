import { Prisma } from "@prisma/client"
import db from "../adapter.ts/database"

interface nodePayload {
    id?: number,
    name: string,
    province: number[],
    created_by: number,
}

export const NodeSvc = {
    getallNodes: async (limit: number, page: number, search: string) => {
        let whereCondition: Prisma.nodesWhereInput = {
            deleted_at: null
        }
        if (search) {
            whereCondition.AND = [
                {
                    name: { contains: search }
                }
            ]
        }
        const total_nodes = await db.nodes.count({ 
            where: whereCondition 
        })
        const totalPages = Math.ceil(total_nodes / limit);
        const offset = (page - 1) * limit;
        const nodes = await db.nodes.findMany({
            where: whereCondition,
            skip: offset,
            take: limit,
            include: {
                province: true
            }
        })
        return {
            page: page,
            limit: limit,
            total_page: totalPages,
            total_rows: total_nodes,
            data: nodes
        }
    },

    createNode: async (payload: nodePayload) => {
        const node = await db.nodes.create({
            data: {
                name: payload.name,
                province: {
					connect: payload.province.map(id => ({ id }))
				},
                created_by: payload.created_by
            }
        })
        return node
    },

    updateNode: async (id: number, payload: nodePayload) => {
        const node = await db.nodes.update({
            where: {
                id: id
            },
            data: {
                name: payload.name,
                province: {
					set: payload.province.map(id => ({ id }))
				},
            }
        })
        return node
    },

    softDeleteNode: async (id: number) => {
        const node = await db.nodes.update({
            where: {
                id: id
            },
            data: {
                deleted_at: new Date()
            }
        })
        return node
    },

    getNodebyID: async (id: number) => {
        const node = await db.nodes.findUnique({
            where: {
                id: id
            },
            include: {
                province: true
            }
        })
        return node
    }

}