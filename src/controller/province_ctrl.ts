import { middleware } from "../middleware/auth"
import { ProvinceSvc } from "../services/province_svc"
import { response } from "./reponse"

export const ProvinceCtrl = {
    getallProvince: async () => {
        const province = await ProvinceSvc.getallProvince();
        return province;
    },

    getProvinceByID: async (ctx: any) => {
        const data = await ProvinceSvc.getProvinceByID(ctx.params.id);
        return response.SuccessResponse(ctx, data);
    },

    createProvince: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx);
        ctx.body.created_by = userID;
        const data = await ProvinceSvc.createProvince({ ...ctx.body });
        return response.SuccessResponse(ctx, data);
    },

    updateProvince: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx);
        ctx.body.created_by = userID;
        const data = await ProvinceSvc.updateProvince(ctx.params.id, { ...ctx.body });
        return response.SuccessResponse(ctx, data);
    },

    deleteProvince: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx);
        ctx.body.created_by = userID;
        const data = await ProvinceSvc.softDeleteProvince(ctx.params.id);
        return response.SuccessResponse(ctx, data);
    }
}