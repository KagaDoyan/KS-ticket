import { MailRecipientCtrl } from "../controller/mail_recipient_ctrl";
import { t } from "elysia";
import { middleware } from "../middleware/auth";

export function MailRecipientRoute(app: any) {
    return app
        .post('/', MailRecipientCtrl.createMailRecipient, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                email: t.String()
            }),
            detail: {
                tags: ['mailRecipient']
            }
        })
        .delete('/:id', MailRecipientCtrl.deleteMailRecipient, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Number()
            }),
            detail: {
                tags: ['mailRecipient']
            }
        })
        .get('/:id', MailRecipientCtrl.getMailRecipientByID, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Number()
            }),
            detail: {
                tags: ['mailRecipient']
            }
        })
        .get('/', MailRecipientCtrl.getMailRecipient, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            query: t.Object({
                limit: t.Numeric(),
                page: t.Numeric(),
                search: t.Optional(t.String())
            }),
            detail: {
                tags: ['mailRecipient']
            }
        })
        .put('/:id', MailRecipientCtrl.updateMailRecipient, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Number()
            }),
            body: t.Object({
                email: t.String()
            }),
            detail: {
                tags: ['mailRecipient']
            }
        })
}