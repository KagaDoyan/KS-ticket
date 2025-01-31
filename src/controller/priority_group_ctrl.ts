import { middleware } from "../middleware/auth"
import { PriorityGroupSvc } from "../services/priority_groups_svc"
import { response } from "./reponse"

export const PriorityGroupCtrl = {
    getallPriorityGroup: async (ctx: any) => {
        const data = await PriorityGroupSvc.getAllPriorityGroup(ctx.query.limit, ctx.query.page, ctx.query.search, ctx.query.customer_id)
        return response.SuccessResponse(ctx, data)
    },

    getAllPriorityGroupOption: async (ctx: any) => {
        const data = await PriorityGroupSvc.getAllPriorityGroupOptions()
        return response.SuccessResponse(ctx, data)
    },

    getPriorityGroupByID: async (ctx: any) => {
        const data = await PriorityGroupSvc.getPriorityGroupByID(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },

    createPriorityGroup: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx);
        ctx.body.created_by = userID;
        const data = await PriorityGroupSvc.createPriorityGroup({ ...ctx.body });
        return response.SuccessResponse(ctx, data);
    },

    updatePriorityGroup: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx)
        ctx.body.created_by = userID
        const data = await PriorityGroupSvc.updatePriorityGroup(ctx.params.id, {...ctx.body})
        return response.SuccessResponse(ctx, data)
    },

    deletePriorityGroup: async (ctx: any) => {
        // const userID = await middleware.GetUserFromToken(ctx)
        // ctx.body.created_by = userID
        const data = await PriorityGroupSvc.softDeletePriorityGroup(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },

    findPriorityGroupByCustomerAndProvince: async (ctx: any) => {
        const data = await PriorityGroupSvc.findPriorityGroupByCustomerAndProvince(ctx.params.customer_id, ctx.params.province_id)
        return response.SuccessResponse(ctx, data)
    }
}
