import { middleware } from "../middleware/auth"
import { ShopSvc } from "../services/shop_svc"
import { response } from "./reponse"

export const ShopCtrl = {
    createshop: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx)
        ctx.body.created_by = userID
        const data = await ShopSvc.createShop({ ...ctx.body })
        return response.SuccessResponse(ctx, data)
    },

    updateshop: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx)
        ctx.body.created_by = userID
        const data = await ShopSvc.updateShop(ctx.params.id, {...ctx.body})
        return response.SuccessResponse(ctx, data)
    },

    deleteshop: async (ctx: any) => {
        // const userID = await middleware.GetUserFromToken(ctx)
        // ctx.body.created_by = userID
        const data = await ShopSvc.softDeleteShop(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },

    getshopByID: async (ctx: any) => {
        const data = await ShopSvc.getShopbyID(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },

    getallshop: async (ctx: any) => {
        const data = await ShopSvc.getallShops(ctx.query.limit, ctx.query.page, ctx.query.search, ctx.query.customer_id)
        return response.SuccessResponse(ctx, data)
    },

    getshopoptions: async (ctx: any) => {
        const data = await ShopSvc.getshopOption()
        return response.SuccessResponse(ctx, data)
    }
}