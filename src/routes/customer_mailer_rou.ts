import { t } from "elysia";
import { CustomerMailerCtrl } from "../controller/customer_mailer";
import { middleware } from "../middleware/auth";
import { bool } from "sharp";

export function CustomerMailerRou(app: any) {
    return app
        .post("/", CustomerMailerCtrl.craeteMailer, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                email : t.String(),
                password : t.String(),
                host : t.String(),
                port : t.String(),
                customer_id: t.Array(t.Numeric())
            }),
            detail: {
                tags: ['Customer Mailer']
            }
        })
        .put("/:id", CustomerMailerCtrl.updateMailer, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            body: t.Object({
                email : t.String(),
                password : t.Optional(t.String()),
                host : t.String(),
                port : t.String(),
                customer_id: t.Array(t.Numeric())
            }),
            detail: {
                tags: ['Customer Mailer']
            }
        })
        .delete("/:id", CustomerMailerCtrl.deleteMailer, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Customer Mailer']
            }
        })
        .get("/:id", CustomerMailerCtrl.getMailer, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Customer Mailer']
            }
        })
        .get("/all", CustomerMailerCtrl.getAllMailers, {
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
                tags: ['Customer Mailer']
            }
        })
        .get("/test/:id", CustomerMailerCtrl.MailerTest, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Customer Mailer']
            }
        })
}