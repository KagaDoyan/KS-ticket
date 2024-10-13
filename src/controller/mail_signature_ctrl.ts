import { mail_signature_svc } from "../services/mail_signature"
import { response } from "./reponse"

export const MailSignatureCtrl = {
    getMailSignature: async (ctx: any) => {
        const data = await mail_signature_svc.getMailSignature(ctx.query.limit, ctx.query.page, ctx.query.search)
        return response.SuccessResponse(ctx, data)
    },
    getMailSignatureById: async (ctx: any) => {
        const data = await mail_signature_svc.getMailSignatureById(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },
    createMailSignature: async (ctx: any) => {
        const data = await mail_signature_svc.createMailSignature({ ...ctx.body })
        return response.SuccessResponse(ctx, data)
    },
    updateMailSignature: async (ctx: any) => {
        const data = await mail_signature_svc.updateMailSignature(ctx.params.id, { ...ctx.body })
        return response.SuccessResponse(ctx, data)
    },
    deleteMailSignature: async (ctx: any) => {
        const data = await mail_signature_svc.deleteMailSignature(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    }
}