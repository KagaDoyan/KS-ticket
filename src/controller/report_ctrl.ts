import { middleware } from "../middleware/auth";
import { reportSvc } from "../services/report_svc";
import { response } from "./reponse";

export const ReportCtrl = {
    getReportMA: async (ctx: any) => {
        const data = await reportSvc.reportMA();
        return response.SuccessResponse(ctx, data); 
    },

    getReportInventory: async (ctx: any) => {
        const data = await reportSvc.reportInventory();
        return response.SuccessResponse(ctx, data); 
    },

    getReportStoreBrokenPart: async (ctx: any) => {
        const data = await reportSvc.reportStoreBrokenPart();
        return response.SuccessResponse(ctx, data); 
    }
}