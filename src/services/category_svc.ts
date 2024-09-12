import { Prisma } from "@prisma/client"
import db from "../adapter.ts/database"

interface categoryPayload {
	id?: number,
	name: string,
	created_by: number
}

export const CategorySvc = {
	getAllCategory: async (limit: number, page: number, search: string) => {
		let whereCondition: Prisma.categoriesWhereInput = {
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
		const total_category = await db.categories.count({ where: whereCondition });
		const totalPages = Math.ceil(total_category / limit);
		const offset = (page - 1) * limit;
		const categories = await db.categories.findMany({
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
			total_rows: total_category,
			data: categories
		}
	},

	getAllCategoryOption: async () => {
		const categories = await db.categories.findMany({
			where: {
				deleted_at: null
			}
		});
		return categories
	},

	getCategoryByID: async (id: number) => {
        const category = await db.categories.findUnique({
            where: {
                id: id
            }
        });
        return category;
    },

	createCategory: async (payload: categoryPayload) => {
		const category = await db.categories.create({
			data: {
				name: payload.name,
				created_by: payload.created_by
			}
		});
		return category;
	},

	updateCategory: async (id: number, payload: categoryPayload) => {
		const category = await db.categories.update({
			where: {
				id: id
			},
			data: {
				name: payload.name,
			}
		});
		return category;
	},

	softDeleteCategory: async (id: number) => {
        const category = await db.categories.update({
            where: {
                id: id,
            },
            data: {
                deleted_at: new Date(),
            }
        });
        return category;
    }
}