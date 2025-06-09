import { t } from "elysia";
import { ShopCtrl } from "../controller/shop_ctrl";
import { middleware } from "../middleware/auth";

export function ShopRoute(app: any) {
    return app
        .get("/", ShopCtrl.getallshop, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            query: t.Object({
                limit: t.Numeric(),
                page: t.Numeric(),
                search: t.Optional(t.String()),
                customer_id: t.Optional(t.String())
            }),
            detail: {
                tags: ['Shop']
            }
        })
        .get("/:id", ShopCtrl.getshopByID, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Shop']
            }
        })
        .post("/", ShopCtrl.createshop, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                shop_name: t.String(),
                shop_number: t.String(),
                phone: t.String(),
                email: t.String(),
                latitude: t.String(),
                longitude: t.String(),
                province_id: t.Numeric(),
                customer_id: t.Numeric(),
                is_cc: t.Optional(t.Nullable(t.Boolean())),
            }),
            detail: {
                tags: ['Shop']
            }
        })
        .put("/:id", ShopCtrl.updateshop, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                shop_name: t.String(),
                shop_number: t.String(),
                phone: t.String(),
                email: t.String(),
                latitude: t.String(),
                longitude: t.String(),
                province_id: t.Numeric(),
                customer_id: t.Numeric(),
                is_cc: t.Optional(t.Nullable(t.Boolean())),
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Shop']
            }
        })
        .delete("/:id", ShopCtrl.deleteshop, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Shop']
            }
        })
        .get("/option", ShopCtrl.getshopoptions, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ['Shop']
            }
        })
    }