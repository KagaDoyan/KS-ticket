import { Prisma } from "@prisma/client";
import db from "../adapter.ts/database";

export const MailRecipientSvc = {
    async getRecipientAll(limit: number, page: number, search: string, brand?: string, customer_id?: string) {
        let whereCondition: Prisma.mail_recipientWhereInput = {}
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

        const total_item = await db.mail_recipient.count({ where: whereCondition });
        const totalPages = Math.ceil(total_item / limit);
        const offset = (page - 1) * limit;
        const items = await db.mail_recipient.findMany({
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

    async getRecipientByID(id: number) {
        const recipient = await db.mail_recipient.findUnique({
            where: {
                id: id
            },
            include: {
                customer: true
            }
        });
        return recipient
    },

    async DeleteRecipient(id: number) {
        const recipient = await db.mail_recipient.delete({
            where: {
                id: id
            }
        });
        return recipient
    },
    async CreateRecipient(payload: any) {
        const recipient = await db.mail_recipient.create({
            data: {
                email: payload.email,
                customer_id: payload.customer_id
            }
        });
        return recipient
    },

    async UpdateRecipient(id: number, payload: any) {
        const recipient = await db.mail_recipient.update({
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