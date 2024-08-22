import { middleware } from "../middleware/auth"
import { itemSvc } from "../services/item_svc"
import { response } from "./reponse"

export const ItemCtrl = {
    getallItem: async (ctx: any) => {
        const data = await itemSvc.getAllItem(ctx.query.limit, ctx.query.page, ctx.query.search)
        return response.SuccessResponse(ctx, data)
    },

    getItemByID: async (ctx: any) => {
        const data = await itemSvc.getItemByID(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },

    createItem: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx);
        ctx.body.created_by = userID;
        const data = await itemSvc.createItem({ ...ctx.body });
        return response.SuccessResponse(ctx, data);
    },

    updateItem: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx)
        ctx.body.created_by = userID
        const data = await itemSvc.updateItem(ctx.params.id, {...ctx.body})
        return response.SuccessResponse(ctx, data)
    },

    updateEngineerItem: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx)
        ctx.body.created_by = userID
        const data = await itemSvc.updateEngineerItem(ctx.params.id, {...ctx.body})
        return response.SuccessResponse(ctx, data)
    },

    deleteItem: async (ctx: any) => {
        const userID = middleware.GetUserFromToken(ctx)
        ctx.body.created_by = userID
        const data = await itemSvc.softDeleteItem(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },

    getItemStatusOption: async (ctx: any) => {
        const data = await itemSvc.itemStatusOption()
        return response.SuccessResponse(ctx, data)
    },

    getItemBySerialNumber: async (ctx: any) => {
        const data = await itemSvc.getItemBySerialNumber(ctx.params.serial_number)
        return response.SuccessResponse(ctx, data)
    }
}
