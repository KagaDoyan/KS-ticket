import { middleware } from "../middleware/auth"
import { StorageSvc } from "../services/storage_svc"
import { response } from "./reponse"

export const StorageCtrl = {
    getallStorage: async (ctx: any) => {
        const data = await StorageSvc.getallStorage(ctx.query.limit, ctx.query.page, ctx.query.search)
        return response.SuccessResponse(ctx, data)
    },

    getStorageByID: async (ctx: any) => {
        const data = await StorageSvc.getStorageByID(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },

    createStorage: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx)
        ctx.body.created_by = userID
        const data = await StorageSvc.createStorage({ ...ctx.body })
        return response.SuccessResponse(ctx, data)
    },

    updateStorage: async (ctx: any) => {
        const data = await StorageSvc.updateStorage(ctx.params.id, {...ctx.body})
        return response.SuccessResponse(ctx, data)
    },

    deleteStorage: async (ctx: any) => {
        const data = await StorageSvc.softDeleteStorage(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },

    getStorageOption: async (ctx: any) => {
        const data = await StorageSvc.getallStorageOptions()
        return response.SuccessResponse(ctx, data)
    }
}