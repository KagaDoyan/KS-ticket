import { middleware } from "../middleware/auth"
import { engineerSvc } from "../services/engineer_svc"
import { response } from "./reponse"

export const EngineerCtrl = {
    getallEngineer: async (ctx: any) => {
        const data = await engineerSvc.getAllEngineer(ctx.query.limit, ctx.query.page, ctx.query.search)
        return response.SuccessResponse(ctx, data)
    },

    getEngineerByID: async (ctx: any) => {
        const data = await engineerSvc.getEngineerByID(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },

    createEngineer: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx);
        ctx.body.created_by = userID;        
        const data = await engineerSvc.createEngineer({ ...ctx.body,province:ctx.body.province_id });
        return response.SuccessResponse(ctx, data);
    },

    updateEngineer: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx)
        ctx.body.created_by = userID
        const data = await engineerSvc.updateEngineer(ctx.params.id, {...ctx.body,province:ctx.body.province_id})
        return response.SuccessResponse(ctx, data)
    },

    deleteEngineer: async (ctx: any) => {
        const userID = middleware.GetUserFromToken(ctx)
        ctx.body.created_by = userID
        const data = await engineerSvc.softDeleteEngineer(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },

    getEngineerOrderByLocation: async (ctx: any) => {
        const data = await engineerSvc.getengineerOrderByLocation(ctx.query.latitude, ctx.query.longitude)
        return response.SuccessResponse(ctx, data)
    }
}
