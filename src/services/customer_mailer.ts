import { get } from "node:http"
import db from "../adapter.ts/database"
import { Prisma } from "@prisma/client"

interface payload {
    id : number
    email : string
    password : string
    host : string
    port : string
    customer_id: number[],
}
export const CustomerMailerSvc = {
    createMailer: async (data: payload) => {
        const mailer = await db.customer_mailer.create({
            data: {
                id: data.id,
                sender_email: data.email,
                sender_password: data.password,
                sender_host: data.host,
                sender_port: data.port,
                customers: {
					connect: data.customer_id.map(id => ({ id }))
				},
            }
        })
        return mailer
    },
    updateMailer: async (id: number, data: payload) => {
        const mailer = await db.customer_mailer.update({
            where: {
                id: id
            },
            data: {
                id: data.id,
                sender_email: data.email,
                sender_password: data.password,
                sender_host: data.host,
                sender_port: data.port,
                customers: {
                    set: data.customer_id.map(id => ({ id }))
                },
            }
        })
        return mailer
    },
    getMailer: async (id: number) => {
        const mailer = await db.customer_mailer.findUnique({
            where: {
                id: id
            }
        })
        return mailer
    },
    deleteMailer: async (id: number) => {
        const mailer = await db.customer_mailer.delete({
            where: {
                id: id
            }
        })
        return mailer
    },
    getAllMailer: async (limit: number, page: number, search: string) => {
        let whereCondition: Prisma.customer_mailerWhereInput = {}
        if (search) {
			whereCondition.AND = [
				{
					OR: [
						{ sender_email: { contains: search } },
                        { customers: { some: { fullname: { contains: search } } } },
                        { customers: { some: { shortname: { contains: search } } } }
					]
				}
			]
		}
        const total_mailer = await db.customer_mailer.count({ where: whereCondition })
        const totalPages = Math.ceil(total_mailer / limit)
        const offset = (page - 1) * limit
        const mailer = await db.customer_mailer.findMany({
            where: whereCondition,
            skip: offset,
            take: limit,
            orderBy: {
                id: "desc"
            }
        })
        return {
            page: page,
            total_pages: totalPages,
            total_mailer: total_mailer,
            mailer: mailer
        }
    }
}