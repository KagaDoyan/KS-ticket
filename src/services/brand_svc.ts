import { Prisma } from "@prisma/client"
import db from "../adapter.ts/database"

interface brandPayload {
	id?: number,
	name: string,
	created_by: number
}

export const BrandSvc = {
	getAllBrand: async (limit: number, page: number, search: string) => {
		let whereCondition: Prisma.brandsWhereInput = {
			deleted_at: null
		}

		if(search){
			whereCondition.AND = [
				{
					OR: [
						{ name: { contains: search } }
					]
				}
			]
		}
		const total_brand = await db.brands.count({ where: whereCondition });
		const totalPages = Math.ceil(total_brand / limit);
		const offset = (page - 1) * limit;
		const brands = await db.brands.findMany({
			where: whereCondition,
			skip: offset,
			take: limit
		});
		return {
			page: page,
            limit: limit,
            total_page: totalPages,
            total_rows: total_brand,
            data: brands
		}
	},

	getBrandByID: async (id: number) => {
        const brand = await db.brands.findUnique({
            where: {
                id: id
            }
        });
        return brand;
    },

	createBrand: async (payload: brandPayload) => {
		const brand = await db.brands.create({
			data: {
				name: payload.name,
				created_by: payload.created_by
			}
		});
		return brand;
	},

	updateBrand: async (id: number, payload: brandPayload) => {
		const brand = await db.brands.update({
			where: {
				id: id
			},
			data: {
				name: payload.name,
			}
		});
		return brand;
	},

	softDeleteBrand: async (id: number) => {
        const brand = await db.brands.update({
            where: {
                id: id,
            },
            data: {
                deleted_at: new Date(),
            }
        });
        return brand;
    },

	getBrandOption: async () => {
		const brands = await db.brands.findMany({
			where: {
				deleted_at: null
			}
		});
		return brands;
	}
}