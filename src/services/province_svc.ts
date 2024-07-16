import { Prisma } from "@prisma/client"
import db from "../adapter.ts/database"

interface provincePayload {
    id?: number,
    name: string,
    code: string,
    priority_group_id: number,
    created_by: number
}

export const ProvinceSvc = {
    getallProvince: async () => {
        const province = await db.provinces.findMany();
        return province;
    },

    getProvinceByID: async (id: number) => {
        const province = await db.provinces.findUnique({
            where: {
                id: id,
            }
        });
        return province;
    },

    createProvince: async (payload: provincePayload) => {
        const province = await db.provinces.create({
            data: {
                name: payload.name,
                code: payload.code,
                priority_group_id: payload.priority_group_id,
                created_by: payload.created_by
            }
        });
        return province;
    },

    updateProvince: async (id: number, payload: provincePayload) => {
        const province = await db.provinces.update({
            where: {
                id: id,
            },
            data: {
                name: payload.name,
                code: payload.code,
                priority_group_id: payload.priority_group_id,
            }
        });
        return province;
    },

    softDeleteProvince: async (id: number) => {
        const province = await db.provinces.update({
            where: {
                id: id,
            },
            data: {
                deleted_at: new Date(),
            }
        });
        return province;
    }
}