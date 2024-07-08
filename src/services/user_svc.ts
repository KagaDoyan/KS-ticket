import { error, NotFoundError } from "elysia";
import db from "../adapter.ts/database";
import { middleware } from "../middleware/auth";
import { AuthenticationError } from "../exception/AuthenticationError";
import { DataNotFoundError } from "../exception/DataNotFound";
import { CryptoUtil } from "../utilities/encryption";
interface userPayload {
    id?: number,
    email: string,
    name: string,
    password: string
}
export const UserSvc = {
    Login: async (ctx: any, payload: userPayload) => {
        const user = await db.users.findUnique({
            where: {
                email: payload.email
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
                id: payload.id,
                name: payload.name,
                email: payload.email,
                password: hashpassword,
            },
            select: {
                id: true
            }
        });
        return user.id
    },

    getallUsers: async () => {
        const users = await db.users.findMany({
            where: {
                deleted_at: null
            }
        })
        return users
    },

    getUserbyID: async (id: number) => {
        const user = await db.users.findUnique({
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