import { Prisma } from "@prisma/client"
import db from "../adapter.ts/database"

interface shopPayload {
    id?: number,
    shop_name: string,
    shop_number: string,
    phone: string,
    email: string,
    latitude: string,
    longitude: string
    province_id: number
    created_by: number
    customer_id: number
    is_cc: boolean
}

export const ShopSvc = {
    getallShops: async (limit: number, page: number, search: string, customer_id: number) => {
        let whereCondition: Prisma.shopsWhereInput = {
            deleted_at: null,
        }

        whereCondition.AND = []

        if (search) {
            whereCondition.AND.push(
                {
                    OR: [
                        { shop_name: { contains: search } },
                        { shop_number: { contains: search } }
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
        const total_shops = await db.shops.count({ where: whereCondition })
        const totalPages = Math.ceil(total_shops / limit);
        const offset = (page - 1) * limit;
        const shops = await db.shops.findMany({
            where: whereCondition,
            skip: offset,
            take: limit,
            orderBy: {
                id: "desc"
            },
            include: {
                customer: true,
                province: true
            }
        })
        return {
            page: page,
            limit: limit,
            total_page: totalPages,
            total_rows: total_shops,
            data: shops
        }
    },

    createShop: async (payload: shopPayload) => {
        const shop = await db.shops.create({
            data: {
                shop_name: payload.shop_name,
                shop_number: payload.shop_number,
                phone: payload.phone,
                email: payload.email,
                latitude: payload.latitude,
                longitude: payload.longitude,
                province_id: payload.province_id,
                created_by: payload.created_by,
                customers_id: payload.customer_id,
                is_cc: payload.is_cc ?? false
            }
        })
        return shop
    },

    updateShop: async (id: number, payload: shopPayload) => {
        const shop = await db.shops.update({
            where: {
                id: id
            },
            data: {
                shop_name: payload.shop_name,
                shop_number: payload.shop_number,
                phone: payload.phone,
                email: payload.email,
                latitude: payload.latitude,
                longitude: payload.longitude,
                province_id: payload.province_id,
                customers_id: payload.customer_id,
                is_cc: payload.is_cc ?? false
            }
        })
        return shop
    },

    getshopOption: async () => {
        const shop = await db.shops.findMany({
            where: {
                deleted_at: null
            },
            include: {
                province: true
            }
        })
        return shop
    },

    softDeleteShop: async (id: number) => {
        const shop = await db.shops.update({
            where: {
                id: id
            },
            data: {
                deleted_at: new Date()
            }
        })
        return shop
    },

    getShopbyID: async (id: number) => {
        const shop = await db.shops.findUnique({
            where: {
                id: id
            }
        })
        return shop
    }

}