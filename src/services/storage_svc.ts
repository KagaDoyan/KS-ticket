import { Prisma } from "@prisma/client"
import db from "../adapter.ts/database"

interface storagePayload {
    id?: number,
    name: string,
    created_by: number
    location: string
    latitude: string
    longitude: string
}
export const StorageSvc = {

    getStorageByID: async (id: number) => {
        const storage = await db.storages.findUnique({
            where: {
                id: id
            }
        })
        return storage
    },

    getallStorage: async (limit: number, page: number, search: string) => {
        let whereCondition: Prisma.storagesWhereInput = {
            deleted_at: null
        }
        if (search) {
            whereCondition.AND = [
                {
                    name: { contains: search }
                }
            ]
        }
        const total_storage = await db.storages.count({ where: whereCondition })
        const totalPages = Math.ceil(total_storage / limit);
        const offset = (page - 1) * limit;
        const storage = await db.storages.findMany({
            where: whereCondition,
            skip: offset,
            take: limit
        });
        return {
            page: page,
            limit: limit,
            total_page: totalPages,
            total_rows: total_storage,
            data: storage
        }
    },

    getallStorageOptions: async () => {
        const storage = await db.storages.findMany({
            where: {
                deleted_at: null
            }
        })
        return storage
    },

    createStorage: async (payload: storagePayload) => {
        const storage = await db.storages.create({
            data: {
                name: payload.name,
                location: payload.location,
                latitude: payload.latitude,
                longitude: payload.longitude,
                craeted_by: payload.created_by,
            }
        })
        return storage
    },

    updateStorage: async (id: number, payload: storagePayload) => {
        const storage = await db.storages.update({
            where: {
                id: id
            },
            data: {
                name: payload.name,
                location: payload.location,
                latitude: payload.latitude,
                longitude: payload.longitude
            }
        })
        return storage
    },

    softDeleteStorage: async (id: number) => {
        const storage = await db.storages.update({
            where: {
                id: id
            },
            data: {
                deleted_at: new Date()
            }
        })
        return storage
    }
}