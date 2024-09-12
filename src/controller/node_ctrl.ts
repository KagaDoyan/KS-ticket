import { middleware } from "../middleware/auth"
import { NodeSvc } from "../services/node_svc"
import { response } from "./reponse"

export const NodeCtrl = {
    createnode: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx)
        ctx.body.created_by = userID
        const data = await NodeSvc.createNode({ ...ctx.body, province: ctx.body.province_id })
        return response.SuccessResponse(ctx, data)
    },

    updatenode: async (ctx: any) => {
        const data = await NodeSvc.updateNode(ctx.params.id, {...ctx.body, province: ctx.body.province_id })
        return response.SuccessResponse(ctx, data)
    },

    deletenode: async (ctx: any) => {
        // const userID = await middleware.GetUserFromToken(ctx)
        // ctx.body.created_by = userID
        const data = await NodeSvc.softDeleteNode(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },

    getnodeByID: async (ctx: any) => {
        const data = await NodeSvc.getNodebyID(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },

    getallnode: async (ctx: any) => {
        const data = await NodeSvc.getallNodes(ctx.query.limit, ctx.query.page, ctx.query.search)
        return response.SuccessResponse(ctx, data)
    },

    getnodeoption: async (ctx: any) => {
        const data = await NodeSvc.getNodeOption()
        return response.SuccessResponse(ctx, data)
    }

}