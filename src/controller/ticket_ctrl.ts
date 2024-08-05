import { middleware } from "../middleware/auth"
import { ticketSvc } from "../services/ticket_svc"
import { response } from "./reponse"

export const TicketCtrl = {
    getallTicket: async (ctx: any) => {
        const data = await ticketSvc.getAllTicket(ctx.query.limit, ctx.query.page, ctx.query.status, ctx.query.search)
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
        const data = await ticketSvc.updateCloseTicket(ctx.params.id, { ...ctx.body });
        return response.SuccessResponse(ctx, data);
    },

    updateReturnItem: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx);
        ctx.body.created_by = userID;
        const data = await ticketSvc.updateReturnItem(ctx.params.id, { ...ctx.body });
        return response.SuccessResponse(ctx, data);
    },

    getTicketByID: async (ctx: any) => {
        const data = await ticketSvc.getTicketByID(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    }
}
