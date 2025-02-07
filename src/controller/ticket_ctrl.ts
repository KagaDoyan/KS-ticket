import { log } from "node:console"
import { middleware } from "../middleware/auth"
import { ticketSvc } from "../services/ticket_svc"
import { response } from "./reponse"

export const TicketCtrl = {
    getallTicket: async (ctx: any) => {
        const data = await ticketSvc.getAllTicket(ctx.query.limit, ctx.query.page, ctx.query.status, ctx.query.search, ctx.query.brand_name)
        return response.SuccessResponse(ctx, data)
    },

    getTicketByDateRange: async (ctx: any) => {
        const data = await ticketSvc.getTicketByDateRange(ctx.query.start, ctx.query.end,ctx.query.brand_name)
        return response.SuccessResponse(ctx, data)
    },

    openTicket: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx);
        ctx.body.created_by = userID;
        ctx.body.updated_by = userID;
        const data = await ticketSvc.openTicket({ ...ctx.body });
        return response.SuccessResponse(ctx, data);
    },

    updateOpenTicket: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx);
        ctx.body.created_by = userID;
        ctx.body.updated_by = userID;
        const data = await ticketSvc.updateOpenTicket(ctx.params.id, { ...ctx.body });
        return response.SuccessResponse(ctx, data);
    },

    updateCloseTicket: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx);
        ctx.body.updated_by = userID;
        ctx.body.created_by = userID;
        const data = await ticketSvc.updateCloseTicket(ctx.params.id, { ...ctx.body }, ctx.formData);
        return response.SuccessResponse(ctx, data);
    },

    // // Test upload image
    // uploadImage: async (ctx: any) => {
    //     const { request } = ctx;
    //     const formData = await request.formData();
    //     const data = await ticketSvc.uploadImage(formData);
    //     return response.SuccessResponse(ctx, data);
    // },

    updateReturnItem: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx);
        ctx.body.created_by = userID;        
        const data = await ticketSvc.updateReturnItem(ctx.params.id, { ...ctx.body });
        return response.SuccessResponse(ctx, data);
    },

    getTicketByID: async (ctx: any) => {
        const data = await ticketSvc.getTicketByID(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },

    deleteShopItem: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx);
        const data = await ticketSvc.deleteShopitem(ctx.params.id, userID)
        return response.SuccessResponse(ctx, data)
    },

    deleteSpareitem: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx);
        const data = await ticketSvc.deleteSpareitem(ctx.params.id, userID)
        return response.SuccessResponse(ctx, data)
    },

    deleteTicket: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx);
        const data = await ticketSvc.softDeleteTicket(ctx.params.id, userID)
        return response.SuccessResponse(ctx, data)
    },

    getNearestEngineer: async (ctx: any) => {
        const data = await ticketSvc.getEngineerThatNearShop(ctx.params.shop_id)
        return response.SuccessResponse(ctx, data)
    },

    sendMail: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx);
        const data = await ticketSvc.sendMail(ctx.params.id, userID)
        return response.SuccessResponse(ctx, data)
    },

    sendReturnMail: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx);
        const data = await ticketSvc.sendReturnMail(ctx.params.id, userID)
        return response.SuccessResponse(ctx, data)
    },

    sendAppointmentMail: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx);
        const data = await ticketSvc.sendAppointmentMail(ctx.params.id, userID, ctx.body.remark)
        return response.SuccessResponse(ctx, data)
    },

    sendOpenTicket: async (ctx:any) => {
        const userID = await middleware.GetUserFromToken(ctx);
        const data = await ticketSvc.sendOpenTicketMail(ctx.params.id, userID)
        return response.SuccessResponse(ctx, data)
    },

    deletereturnitem: async (ctx: any) => {
        // const userID = await middleware.GetUserFromToken(ctx);
        const data = await ticketSvc.deleteReturnItem(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    }
}
