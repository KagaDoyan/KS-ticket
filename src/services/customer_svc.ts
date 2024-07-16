import { Prisma } from "@prisma/client"
import db from "../adapter.ts/database"
interface customePayload {
    id?: number,
    fullname: string,
    shortname: string
    created_by: number
}

export const CustomerSvc = {
    getallCustome: async (limit: number, page: number,search: string) => {
        let whereCondition: Prisma.customersWhereInput = {
            deleted_at: null
        }

        if (search) {
            whereCondition.AND = [
                {
                    OR: [
                        { fullname: { contains: search } },
                        { shortname: { contains: search } }
                    ]
                }
            ]
        }
        const total_customer = await db.customers.count({ where: whereCondition })
        const totalPages = Math.ceil(total_customer / limit);
        const offset = (page - 1) * limit;

        const customer = await db.customers.findMany({
            where: whereCondition,
            skip: offset,
            take: limit
        });

        return {
            page: page,
            limit: limit,
            total_page: totalPages,
            total_rows: total_customer,
            data: customer,
        };
    },

    createCustome: async (payload: customePayload) => {
        const custome = await db.customers.create({
            data: {
                fullname: payload.fullname,
                shortname: payload.shortname,
                created_by: payload.created_by
            },
            select: {
                id: true
            }
        })
        return custome.id
    },

    updateCustome: async (id: number, payload: customePayload) => {
        const custome = await db.customers.update({
            where: {
                id: id
            },
            data: {
                fullname: payload.fullname,
                shortname: payload.shortname
            }
        })
        return custome
    },

    softDeleteCustome: async (id: number) => {
        const custome = await db.customers.update({
            where: {
                id: id
            },
            data: {
                deleted_at: new Date()
            }
        })
        return custome
    },

    getCustomerbyID: async (id: number) => {
        const custome = await db.customers.findUnique({
            where: {
                id: id
            }
        })
        return custome
    }

}