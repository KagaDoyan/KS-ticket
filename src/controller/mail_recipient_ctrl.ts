import { MailRecipientSvc } from "../services/mail_recipient_svc"
import { response } from "./reponse"

export const MailRecipientCtrl = {
    async getMailRecipient(ctx: any) {
        const data = await MailRecipientSvc.getRecipientAll(ctx.query.limit, ctx.query.page, ctx.query.search, ctx.query.brand, ctx.query.customer_id);
        return response.SuccessResponse(ctx, data)
    },
    async createMailRecipient(ctx: any) {
        const data = await MailRecipientSvc.CreateRecipient(ctx.body);
        return response.SuccessResponse(ctx, data)
    },

    async updateMailRecipient(ctx: any) {
        const data = await MailRecipientSvc.UpdateRecipient(ctx.params.id, ctx.body);
        return response.SuccessResponse(ctx, data)
    },

    async deleteMailRecipient(ctx: any) {
        const data = await MailRecipientSvc.DeleteRecipient(ctx.params.id);
        return response.SuccessResponse(ctx, data)
    },

    async getMailRecipientByID(ctx: any) {
        const data = await MailRecipientSvc.getRecipientByID(ctx.params.id);
        return response.SuccessResponse(ctx, data)
    }
}