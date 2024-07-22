import { middleware } from "../middleware/auth"
import { ModelSvc } from "../services/model_svc"
import { response } from "./reponse"

export const ModelCtrl = {
    getallModel: async (ctx: any) => {
        const data = await ModelSvc.getAllModel(ctx.query.limit, ctx.query.page, ctx.query.search)
        return response.SuccessResponse(ctx, data)
    },

    getModelByID: async (ctx: any) => {
        const data = await ModelSvc.getModelByID(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },

    createModel: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx);
        ctx.body.created_by = userID;
        const data = await ModelSvc.createModel({ ...ctx.body });
        return response.SuccessResponse(ctx, data);
    },

    updateModel: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx)
        ctx.body.created_by = userID
        const data = await ModelSvc.updateModel(ctx.params.id, {...ctx.body})
        return response.SuccessResponse(ctx, data)
    },

    deleteModel: async (ctx: any) => {
        const userID = middleware.GetUserFromToken(ctx)
        ctx.body.created_by = userID
        const data = await ModelSvc.softDeleteModel(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },

    getModelOption: async (ctx: any) => {
        const data = await ModelSvc.getAllModelOption()
        return response.SuccessResponse(ctx, data)
    }
}
