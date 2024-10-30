import { CustomerMailerSvc } from "../services/customer_mailer"
import { response } from "./reponse"

export const CustomerMailerCtrl = {
    craeteMailer: async (ctx:any) => {
        const data = await CustomerMailerSvc.createMailer({...ctx.body})
        return response.SuccessResponse(ctx, data)
    },
    getMailer: async (ctx:any) => {
        const data = await CustomerMailerSvc.getMailer(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },
    getAllMailers: async (ctx:any) => {
        const data = await CustomerMailerSvc.getAllMailer(ctx.query.limit, ctx.query.page, ctx.query.search)
        return response.SuccessResponse(ctx, data)
    },
    updateMailer: async (ctx:any) => {
        const data = await CustomerMailerSvc.updateMailer(ctx.params.id, {...ctx.body})
        return response.SuccessResponse(ctx, data)
    },
    deleteMailer: async (ctx:any) => {
        const data = await CustomerMailerSvc.deleteMailer(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },

    MailerTest: async (ctx:any) => {
        const data = await CustomerMailerSvc.TestMailer(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    }
}