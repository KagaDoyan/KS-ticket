import { t } from "elysia";
import { middleware } from "../middleware/auth";
import { MailSignatureCtrl } from "../controller/mail_signature_ctrl";

export function MailSignatureRoute(app: any) {
    return app
        .get('/', MailSignatureCtrl.getMailSignature, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            query: t.Object({
                limit: t.Optional(t.Numeric()),
                page: t.Optional(t.Numeric()),
                search: t.Optional(t.String())
            }),
            detail: {
                tags: ['mail_signature']
            }
        })
        .post('/', MailSignatureCtrl.createMailSignature, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                customer_id: t.Numeric(),
                signature_body: t.String(),
                image: t.Optional(t.String()),
                upload_image: t.Optional(t.Any())
            }),

            detail: {
                tags: ['mail_signature']
            }
        })
        .put('/:id', MailSignatureCtrl.updateMailSignature,{
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Number()
            }),
            body: t.Object({
                customer_id: t.Numeric(),
                signature_body: t.String(),
                image_path: t.Optional(t.String()),
                upload_image: t.Optional(t.File())
            }),
            detail: {
                tags: ['mail_signature']
            }
        })
        .delete('/:id', MailSignatureCtrl.deleteMailSignature,{
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['mail_signature']
            }
        })
        .get('/:id', MailSignatureCtrl.getMailSignatureById,{
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['mail_signature']
            }
        })
}