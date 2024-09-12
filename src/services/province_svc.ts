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

    getallProvincepaginate: async (limit: number, page: number, search: string) => {
        let whereCondition: Prisma.provincesWhereInput = {
            deleted_at: null
        }

        if (search) {
            whereCondition.AND = [
                {
                    OR: [
                        { name: { contains: search } },
                        { code: { contains: search } },
                    ]
                }
            ]
        }
        const total_item = await db.provinces.count({ where: whereCondition });
        const totalPages = Math.ceil(total_item / limit);
        const offset = (page - 1) * limit;
        const province = await db.provinces.findMany({
            where: whereCondition,
            skip: offset,
            take: limit,
			orderBy: {
				id: "desc"
			}
        });
        return {
            page: page,
            limit: limit,
            total_page: totalPages,
            total_rows: total_item,
            data: province
        }
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