import { t } from "elysia";
import { ItemCtrl } from "../controller/item_ctrl";
import { middleware } from "../middleware/auth";

export function ItemRoute(app: any) {
    return app
        .get("/", ItemCtrl.getallItem, {
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
                tags: ['Item']
            }
        })
        .get("/:id", ItemCtrl.getItemByID, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Item']
            }
        })
        .post("/", ItemCtrl.createItem, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                serial_number: t.String(),
                category_id: t.Numeric(),
                brand_id: t.Numeric(),
                model_id: t.Numeric(),
                warranty_expiry_date: t.Date(),
                inc_number: t.String(),
                status: t.String(),
                type: t.String(),
            }),
            detail: {
                tags: ['Item']
            }
        })
        .put("/:id", ItemCtrl.updateItem, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                serial_number: t.String(),
                category_id: t.Numeric(),
                brand_id: t.Numeric(),
                model_id: t.Numeric(),
                warranty_expiry_date: t.Date(),
                inc_number: t.String(),
                status: t.String(),
                type: t.String(),
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Item']
            }
        })
        .delete("/:id", ItemCtrl.deleteItem, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Item']
            }
        })
        .get("/status", ItemCtrl.getItemStatusOption, {
            // beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ['Item']
            }
        })
    }