import { t } from "elysia";
import { ReportCtrl } from "../controller/report_ctrl";
import { middleware } from "../middleware/auth";

export function ReportRoute(app: any) {
    return app
        .get("/ma", ReportCtrl.getReportMA, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            query: t.Object({
                from: t.String(),
                to: t.String(),
                brand_name: t.Optional(t.String()),
            }),
            detail: {
                tags: ['Report']
            }
        })
        .get("/inventory", ReportCtrl.getReportInventory, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            query: t.Object({
                brand_name: t.Optional(t.String()),
            }),
            detail: {
                tags: ['Report']
            }
        })
        .get("/sparebrokenpart", ReportCtrl.getReportStoreBrokenPart, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            query: t.Object({
                from: t.String(),
                to: t.String(),
                brand_name: t.Optional(t.String()),
            }),
            detail: {
                tags: ['Report']
            }
        })
        .get("/engineerkpi", ReportCtrl.getReportEngineerKPI, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            query: t.Object({
                from: t.String(),
                to: t.String(),
                brand_name: t.Optional(t.String()),
            }),
            detail: {
                tags: ['Report']
            }
        })
        .get("/ticketkpi", ReportCtrl.getReportTicketKPI, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            query: t.Object({
                from: t.String(),
                to: t.String(),
                brand_name: t.Optional(t.String()),
            }),
            detail: {
                tags: ['Report']
            }
        })
        .get("/return", ReportCtrl.getReportReturnItem, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            query: t.Object({
                from: t.String(),
                to: t.String(),
                brand_name: t.Optional(t.String()),
            }),
            detail: {
                tags: ['Report']
            }
        })
}