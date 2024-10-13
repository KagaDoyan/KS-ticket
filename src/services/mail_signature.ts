import { Prisma } from "@prisma/client";
import db from "../adapter.ts/database"

async function generateNameForImage(name: string) {
    let ext = "." + name.split(".")[1];
    let uuid = crypto.randomUUID();
    let imageName = uuid + ext;
    let checkImage = await db.ticket_images.findFirst({
        where: {
            deleted_at: null,
            name: imageName
        }
    });
    if (checkImage) {
        return generateNameForImage(name);
    }
    return imageName;
}

interface payload {
    customer_id: number
    signature_body: string
    image_path?: string
    upload_image?: File
}

export const mail_signature_svc = {
    getMailSignature: async (limit: number, page: number, search: string) => {
        const whereCondition: Prisma.mail_signatureWhereInput = {}
        if (search) {
            whereCondition.AND = [
                {
                    customer: {
                        shortname: {
                            contains: search
                        },
                    }
                }
            ]
        }
        const total_item = await db.mail_signature.count({
            where: whereCondition
        });
        const totalPages = Math.ceil(total_item / limit);
        const offset = (page - 1) * limit;
        const signature = await db.mail_signature.findMany({
            where: whereCondition,
            take: limit,
            skip: (page - 1) * limit,
            include: {
                customer: true
            }
        })
        return {
            page: page,
            limit: limit,
            total_page: totalPages,
            total_rows: total_item,
            data: signature
        }
    },

    getMailSignatureById: async (id: number) => {
        const signature = await db.mail_signature.findFirst({
            where: {
                id: id
            },
            include: {
                customer: true
            }
        })
        return signature
    },

    createMailSignature: async (payload: payload) => {
        const file = payload.upload_image as File
        let imageName = "";
        if (file) {
            imageName = await generateNameForImage(file.name);
            await Bun.write(`files/` + imageName, file);
        }
        const signature = await db.mail_signature.create({
            data: {
                customers_id: payload.customer_id,
                signature_body: payload.signature_body ?? "",
                image: imageName
            }
        })
        return signature
    },

    updateMailSignature: async (id: number, payload: payload) => {
        const file = payload.upload_image as File
        let imageName = payload.image_path;
        if (file) {
            imageName = await generateNameForImage(file.name);
            await Bun.write(`files/` + imageName, file);
        }
        const signature = await db.mail_signature.update({
            where: {
                id: id
            },
            data: {
                signature_body: payload.signature_body,
                image: imageName,
                customers_id: payload.customer_id
            }
        })
        return signature
    },

    deleteMailSignature: async (id: number) => {
        const signature = await db.mail_signature.delete({
            where: {
                id: id
            }
        })
        return signature
    }


}