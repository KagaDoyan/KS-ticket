import { t } from "elysia";
import { UserSvc } from "../services/user_svc";
import { response } from "./reponse";
import { middleware } from "../middleware/auth";

export const UserCtrl = {
    Login: async (ctx: any) => {
        const data = await UserSvc.Login(ctx, {
            ...ctx.body
        })
        return response.SuccessResponse(ctx, data)
    },

    whoami: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx)
        console.log(userID);

        const user = await UserSvc.getUserbyID(userID)
        return response.SuccessResponse(ctx, user)
    },

    getallUsers: async (ctx: any) => {
        const data = await UserSvc.getallUsers()
        return response.SuccessResponse(ctx, data)
    },

    getUserbyID: async (ctx: any) => {
        let id = ctx.params.id
        const data = await UserSvc.getUserbyID(Number(id))
        return response.SuccessResponse(ctx, data)
    },

    createUser: async (ctx: any) => {
        const userid = await UserSvc.createUser(
            {
                ...ctx.body
            }
        );
        ctx.set.status = 201;
        return {
            status: "success",
            message: `user ${ctx.body.name} successfully created!`,
            data: {
                id: userid
            }
        };
    }
};