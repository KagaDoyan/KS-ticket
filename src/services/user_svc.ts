import db from "../adapter.ts/database";
import { middleware } from "../middleware/auth";
import { AuthenticationError } from "../exception/AuthenticationError";
import { DataNotFoundError } from "../exception/DataNotFound";
import { CryptoUtil } from "../utilities/encryption";
import { Prisma } from "@prisma/client";
interface userPayload {
    id?: number,
    email: string,
    role: string,
    fullname: string,
    password: string
}
export const UserSvc = {
    Login: async (ctx: any, payload: userPayload) => {
        const user = await db.users.findUnique({
            where: {
                email: payload.email,
                deleted_at: null
            }
        })
        if (!user) {
            throw new AuthenticationError("Bad Credential")
        }
        let hashpassword = CryptoUtil.encryptData(payload.password)
        if (user?.password == hashpassword) {
            const token = middleware.GenerateToken(ctx, user.id)
            return token
        } else {
            throw new AuthenticationError("Bad Credential")
        }
    },

    createUser: async (payload: userPayload) => {
        let hashpassword = CryptoUtil.encryptData(payload.password)
        // let hashpassword = payload.password
        const user = await db.users.create({
            data: {
                fullname: payload.fullname,
                email: payload.email,
                password: hashpassword,
                role: payload.role
            },
            select: {
                id: true
            }
        });
        return user.id
    },

    updateUser: async (id: number, payload: userPayload) => {
        const user = await db.users.update({
            where: {
                id: id
            },
            data: {
                fullname: payload.fullname,
                email: payload.email,
                role: payload.role,
            }
        });
        return user
    },

    getallUsers: async (limit: number, page: number, search: string) => {
        const whereCondition: Prisma.usersWhereInput = {
            deleted_at: null
        }
        if (search) {
            whereCondition.AND = [
                {
                    OR: [
                        { fullname: { contains: search } },
                        { email: { contains: search } },
                        { role: { contains: search } }
                    ]
                }
            ];
        }

        const total_users = await db.users.count({
            where: whereCondition
        });

        const totalPages = Math.ceil(total_users / limit);
        const offset = (page - 1) * limit;

        const users = await db.users.findMany({
            omit: {
                password: true
            },
            where: whereCondition,
            skip: offset,
            take: limit
        });

        return {
            page: page,
            limit: limit,
            total_page: totalPages,
            total_rows: total_users,
            data: users,
        };

    },

    getUserbyID: async (id: number) => {
        const user = await db.users.findUnique({
            omit: {
                password: true
            },
            where: {
                id: id
            }
        })
        if (!user) {
            throw new DataNotFoundError
        }
        return user
    },

    softDeleteUser: async (id: number) => {
        const user = await db.users.update({
            where: { id },
            data: {
                deleted_at: new Date()
            },
            select: {
                id: true
            }
        })
        return user
    },

    deleteUser: async (id: number) => {
        const user = await db.users.delete({
            where: { id },
            select: {
                id: true
            }
        })
        return user
    }
}