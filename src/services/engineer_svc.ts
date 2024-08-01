import { Prisma } from "@prisma/client"
import db from "../adapter.ts/database"
import { CryptoUtil } from "../utilities/encryption";

interface engineerPayload {
	id?: number,
	name: string,
	lastname: string,
	phone: string,
	line_name: string,
	latitude: string,
	longitude: string,
	province: number[]
	node: string,
	password: string,
	created_by: number,
	email: string,
	role: string,
}

export const engineerSvc = {
	getAllEngineer: async (limit: number, page: number, search: string) => {
		let whereCondition: Prisma.engineersWhereInput = {
			deleted_at: null
		}

		if (search) {
			whereCondition.AND = [
				{
					OR: [
						{ name: { contains: search } },
						{ lastname: { contains: search } }
					]
				}
			]
		}
		const total_item = await db.engineers.count({ where: whereCondition });
		const totalPages = Math.ceil(total_item / limit);
		const offset = (page - 1) * limit;
		const engineers = await db.engineers.findMany({
			where: whereCondition,
			skip: offset,
			take: limit
		});
		return {
			page: page,
			limit: limit,
			total_page: totalPages,
			total_rows: total_item,
			data: engineers
		}
	},

	getEngineerByID: async (id: number) => {
		const engineer = await db.engineers.findUnique({
			where: {
				id: id
			},
			include: {
				province: true
			}
		});
		return engineer;
	},

	createEngineer: async (payload: engineerPayload) => {
		console.log(payload.province);
		let hashpassword = CryptoUtil.encryptData(payload.password);
		const engineer = await db.engineers.create({
			data: {
				name: payload.name,
				lastname: payload.lastname,
				phone: payload.phone,
				line_name: payload.line_name,
				latitude: payload.latitude,
				longitude: payload.longitude,
				province: {
					connect: payload.province.map(id => ({ id }))
				},
				node: payload.node,
				password: hashpassword,
				created_by: payload.created_by
			},
			select: {
				id: true
			}
		});
		const user = await db.users.create({
			data: {
				fullname: payload.name + " " + payload.lastname,
				email: payload.email,
				password: hashpassword,
				role: "Engineer"
			},
			select: {
				id: true
			}
		});
		return engineer.id;
	},

	updateEngineer: async (id: number, payload: engineerPayload) => {
		const engineer = await db.engineers.update({
			where: {
				id: id
			},
			data: {
				name: payload.name,
				lastname: payload.lastname,
				phone: payload.phone,
				line_name: payload.line_name,
				latitude: payload.latitude,
				longitude: payload.longitude,
				province: {
					set: payload.province.map((provinceId) => ({ id: provinceId })),
				},
				node: payload.node
			}
		});
		// await db.users.update({
		// 	where: {
		// 		id: engineer.created_by
		// 	},
		// 	data: {
		// 		fullname: payload.name + " " + payload.lastname,
		// 		email: payload.email,
		// 		role: payload.role,
		// 	}
		// });
		return engineer;
	},

	softDeleteEngineer: async (id: number) => {
		const engineer = await db.engineers.update({
			where: {
				id: id,
			},
			data: {
				deleted_at: new Date(),
			},
			select: {
				id: true,
				created_by: true
			}
		});
		await db.users.update({
			where: { id: engineer.created_by },
			data: {
				deleted_at: new Date()
			}
		})
		return engineer;
	},

	getengineerOrderByLocation: async (lat: string, lng: string) => {
		const engineers = await db.engineers.findMany({
			where: {
				deleted_at: null
			},
		})
		// calculate distance logic here
		return engineers
	}
}