import { t } from "elysia";
import { CustomerCtrl } from "../controller/customer_ctrl";
import { middleware } from "../middleware/auth";

export function CustomerRoute(app: any) {
    return app
        .get("/", CustomerCtrl.getAllCustomer, {
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
                tags: ['Customer']
            }
        })
        .get("/:id", CustomerCtrl.getCustomerByID, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Customer']
            }
        })
        .post("/", CustomerCtrl.createcustomer, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                fullname: t.String(),
                shortname: t.String(),
            }),
            detail: {
                tags: ['Customer']
            }
        })
        .put("/:id", CustomerCtrl.updateCustomer, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                fullname: t.String(),
                shortname: t.String(),
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Customer']
            }
        })
        .delete("/:id", CustomerCtrl.deleteCustomer, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Customer']
            }
        })
}