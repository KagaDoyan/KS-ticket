import { middleware } from "../middleware/auth"
import { InventorySvc } from "../services/inventory_svc"
import { response } from "./reponse"

export const InventoryCtrl = {
    getallInventory: async (ctx: any) => {
        const data = await InventorySvc.getAllInventory(ctx.query.limit, ctx.query.page, ctx.query.search)
        return response.SuccessResponse(ctx, data)
    },

    getInventoryByID: async (ctx: any) => {
        const data = await InventorySvc.getInventoryByID(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },

    createInventory: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx);
        ctx.body.created_by = userID;
        const data = await InventorySvc.createInventory({ ...ctx.body });
        return response.SuccessResponse(ctx, data);
    },

    updateInventory: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx)
        ctx.body.created_by = userID
        const data = await InventorySvc.updateInventory(ctx.params.id, {...ctx.body})
        return response.SuccessResponse(ctx, data)
    },

    deleteInventory: async (ctx: any) => {
        // const userID = await middleware.GetUserFromToken(ctx)
        // ctx.body.created_by = userID
        const data = await InventorySvc.softDeleteInventory(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },
}
