import { middleware } from "../middleware/auth"
import { BrandSvc } from "../services/brand_svc"
import { response } from "./reponse"

export const BrandCtrl = {
    getallBrand: async (ctx: any) => {
        const data = await BrandSvc.getAllBrand(ctx.query.limit, ctx.query.page, ctx.query.search)
        return response.SuccessResponse(ctx, data)
    },

    getBrandByID: async (ctx: any) => {
        const data = await BrandSvc.getBrandByID(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },

    createBrand: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx);
        ctx.body.create_by = userID;
        const data = await BrandSvc.createBrand({ ...ctx.body });
        return response.SuccessResponse(ctx, data);
    },

    updateBrand: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx)
        ctx.body.created_by = userID
        const data = await BrandSvc.updateBrand(ctx.params.id, {...ctx.body})
        return response.SuccessResponse(ctx, data)
    },

    deleteBrand: async (ctx: any) => {
        const userID = middleware.GetUserFromToken(ctx)
        ctx.body.created_by = userID
        const data = await BrandSvc.softDeleteBrand(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    }
}
