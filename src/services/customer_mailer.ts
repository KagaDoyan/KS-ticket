import nodemailer from 'nodemailer';
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
        //find mailer by customer id list
        const checkMailer = await db.customer_mailer.findFirst({
            where: {
                customers: {
                    some: {
                        id: {
                            in: data.customer_id
                        }
                    }
                }
            }
        })
        if (checkMailer) {
            throw new Error("mailer with these customer already exist")
        }
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
        const checkMailer = await db.customer_mailer.findFirst({
            where: {
                customers: {
                    some: {
                        id: {
                            in: data.customer_id
                        }
                    }
                }
            }
        })        
        if (checkMailer && checkMailer.id != id) {
            throw new Error("mailer with these customer already exist")
        }
        const mailer = await db.customer_mailer.update({
            where: {
                id: id
            },
            data: {
                id: data.id,
                sender_email: data.email,
                sender_host: data.host,
                sender_port: data.port,
                customers: {
                    set: data.customer_id.map(id => ({ id }))
                },
            }
        })
        if (data.password) {
            await db.customer_mailer.update({
                where: {
                    id: id
                },
                data: {
                    sender_password: data.password
                }
            })
        }
        return mailer
    },
    getMailer: async (id: number) => {
        const mailer = await db.customer_mailer.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                sender_email: true,
                sender_host: true,
                sender_port: true,
                customers: true
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
            },
            select: {
                id: true,
                sender_email: true,
                sender_host: true,
                sender_port: true,
                customers: true
            }
        })
        
        return {
            page: page,
            total_pages: totalPages,
            total_mailer: total_mailer,
            total_rows: total_mailer,
            limit: limit,
            data: mailer
        }
    },

    TestMailer: async (id: number) => {
        const mailer = await db.customer_mailer.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                sender_email: true,
                sender_host: true,
                sender_port: true,
                sender_password: true
            }
        })
        if (!mailer) {
            throw new Error("mailer not found")
        }
        //ping smtp server with mailer with node_mailer
        const transporter = nodemailer.createTransport({
            host: mailer.sender_host,
            port: parseInt(mailer.sender_port), // port for secure SMTP
            tls: {
                ciphers: 'SSLv3'
            },
            secure: false,
            auth: {
                user: mailer.sender_email,
                pass: mailer.sender_password
            },
        });
        

        const mailOptions = {
            from: mailer.sender_email,
            to: "panoudeth@gmail.com",
            subject: "Test Mailer",
            text: "Test Mailer",
        };

        const response = await transporter.sendMail(mailOptions);
        return response.response
    }
}