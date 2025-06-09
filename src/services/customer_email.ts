import { Prisma } from "@prisma/client";
import db from "../adapter.ts/database";

export const CustomerEmailSvc = {
    async getCustomerEmailAll(limit: number, page: number, search: string, brand?: string, customer_id?: string) {
        let whereCondition: Prisma.customer_mailWhereInput = {}
        whereCondition.AND = []
        if (customer_id) {
            whereCondition.AND.push(
                {
                    customer_id: Number(customer_id)
                }
            )
        }
        if (search) {
            whereCondition.AND.push(
                {
                    OR: [
                        { email: { contains: search } },
                        { customer: { shortname: { contains: search } } }
                    ]
                }
            )
        }

        if (brand) {
            whereCondition.AND.push(
                {
                    customer: {
                        shortname: {
                            equals: brand
                        }
                    }
                }
            )
        }

        const total_item = await db.customer_mail.count({ where: whereCondition });
        const totalPages = Math.ceil(total_item / limit);
        const offset = (page - 1) * limit;
        const items = await db.customer_mail.findMany({
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
            total_rows: total_item,
            data: items
        }
    },

    async getCustomerEmailByID(id: number) {
        const recipient = await db.customer_mail.findUnique({
            where: {
                id: id
            },
            include: {
                customer: true
            }
        });
        return recipient
    },

    async DeleteCustomerEmail(id: number) {
        const recipient = await db.customer_mail.delete({
            where: {
                id: id
            }
        });
        return recipient
    },
    async CreateCustomerEmail(payload: any) {
        const recipient = await db.customer_mail.create({
            data: {
                email: payload.email,
                customer_id: payload.customer_id
            }
        });
        return recipient
    },

    async UpdateCustomerEmail(id: number, payload: any) {
        const recipient = await db.customer_mail.update({
            where: {
                id: id
            },
            data: {
                email: payload.email,
                customer_id: payload.customer_id
            }
        });
        return recipient
    },

}