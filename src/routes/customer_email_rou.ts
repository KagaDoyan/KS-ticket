import { CustomerEmailCtrl } from "../controller/customer_email_ctrl";
import { t } from "elysia";
import { middleware } from "../middleware/auth";

export function CustomerEmailRoute(app: any) {
    return app
        .post('/', CustomerEmailCtrl.createCustomerEmail, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                email: t.String(),
                customer_id: t.Optional(t.Number())
            }),
            detail: {
                tags: ['customerEmail']
            }
        })
        .delete('/:id', CustomerEmailCtrl.deleteCustomerEmail, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Number()
            }),
            detail: {
                tags: ['customerEmail']
            }
        })
        .get('/:id', CustomerEmailCtrl.getCustomerEmailByID, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Number()
            }),
            detail: {
                tags: ['customerEmail']
            }
        })
        .get('/', CustomerEmailCtrl.getCustomerEmail, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            query: t.Object({
                limit: t.Numeric(),
                page: t.Numeric(),
                search: t.Optional(t.String()),
                brand: t.Optional(t.String()),
                customer_id: t.Optional(t.String())
            }),
            detail: {
                tags: ['customerEmail']
            }
        })
        .put('/:id', CustomerEmailCtrl.updateCustomerEmail, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Number()
            }),
            body: t.Object({
                email: t.String(),
                customer_id: t.Optional(t.Number()),
            }),
            detail: {
                tags: ['customerEmail']
            }
        })
}