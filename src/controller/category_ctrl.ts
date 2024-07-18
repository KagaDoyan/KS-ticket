import { middleware } from "../middleware/auth"
import { CategorySvc } from "../services/category_svc"
import { response } from "./reponse"

export const CategoryCtrl = {
    getallCategory: async (ctx: any) => {
        const data = await CategorySvc.getAllCategory(ctx.query.limit, ctx.query.page, ctx.query.search)
        return response.SuccessResponse(ctx, data)
    },

    getCategoryByID: async (ctx: any) => {
        const data = await CategorySvc.getCategoryByID(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },

    createCategory: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx);
        ctx.body.created_by = userID;
        const data = await CategorySvc.createCategory({ ...ctx.body });
        return response.SuccessResponse(ctx, data);
    },

    updateCategory: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx)
        ctx.body.created_by = userID
        const data = await CategorySvc.updateCategory(ctx.params.id, {...ctx.body})
        return response.SuccessResponse(ctx, data)
    },

    deleteCategory: async (ctx: any) => {
        const userID = middleware.GetUserFromToken(ctx)
        ctx.body.created_by = userID
        const data = await CategorySvc.softDeleteCategory(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    }
}
