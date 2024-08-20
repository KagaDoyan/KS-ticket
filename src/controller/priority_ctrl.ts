import { middleware } from "../middleware/auth"
import { PrioritySvc } from "../services/priority_svc"
import { response } from "./reponse"

export const PriorityCtrl = {
    getallPriority: async (ctx: any) => {
        const data = await PrioritySvc.getAllPriority(ctx.query.limit, ctx.query.page, ctx.query.search)
        return response.SuccessResponse(ctx, data)
    },

    getPriorityByID: async (ctx: any) => {
        const data = await PrioritySvc.getPriorityByID(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },

    createPriority: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx);
        ctx.body.created_by = userID;
        const data = await PrioritySvc.createPriority({ ...ctx.body });
        return response.SuccessResponse(ctx, data);
    },

    updatePriority: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx)
        ctx.body.created_by = userID
        const data = await PrioritySvc.updatePriority(ctx.params.id, {...ctx.body})
        return response.SuccessResponse(ctx, data)
    },

    deletePriority: async (ctx: any) => {
        const userID = middleware.GetUserFromToken(ctx)
        // ctx.body.created_by = userID
        const data = await PrioritySvc.softDeletePriority(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    }
}
