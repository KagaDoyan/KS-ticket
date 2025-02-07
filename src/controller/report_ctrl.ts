import { middleware } from "../middleware/auth";
import { reportSvc } from "../services/report_svc";
import { response } from "./reponse";

export const ReportCtrl = {
    getReportMA: async (ctx: any) => {
        const data = await reportSvc.reportMA(ctx.query.from, ctx.query.to, ctx.query.brand_name);
        return response.SuccessResponse(ctx, data);
    },

    getReportInventory: async (ctx: any) => {
        const data = await reportSvc.reportInventory(ctx.query.brand_name);
        return response.SuccessResponse(ctx, data);
    },

    getReportStoreBrokenPart: async (ctx: any) => {
        const data = await reportSvc.reportStoreBrokenPart(ctx.query.from, ctx.query.to, ctx.query.brand_name);
        return response.SuccessResponse(ctx, data);
    },

    getReportEngineerKPI: async (ctx: any) => {
        const data = await reportSvc.reportEngineerKPI(ctx.query.from, ctx.query.to, ctx.query.brand_name);
        return response.SuccessResponse(ctx, data);
    },

    getReportTicketKPI: async (ctx: any) => {
        const data = await reportSvc.reportTicketKPI(ctx.query.from, ctx.query.to, ctx.query.brand_name);
        return response.SuccessResponse(ctx, data);
    },

    getReportReturnItem: async (ctx: any) => {
        const data = await reportSvc.ReportReturn(ctx.query.from, ctx.query.to, ctx.query.brand_name);
        return response.SuccessResponse(ctx, data);
    }
}