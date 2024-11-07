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
                customer_id: t.Optional(t.Number()),
                warranty_expiry_date: t.Optional(t.Date()),
                inc_number: t.Optional(t.String()),
                status: t.String(),
                storage_id: t.Number(),
                item_type: t.Optional(t.String()),
                condition: t.Optional(t.Nullable(t.String())),
                remark: t.Optional(t.Nullable(t.String())),
                reuse: t.Optional(t.Boolean()),
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
                customer_id: t.Optional(t.Number()),
                model_id: t.Numeric(),
                warranty_expiry_date: t.Optional(t.Date()),
                inc_number: t.Optional(t.String()),
                status: t.String(),
                storage_id: t.Number(),
                remark: t.Optional(t.Nullable(t.String())),
                condition: t.Optional(t.Nullable(t.String())),
                item_type: t.Optional(t.String()),
                reuse: t.Optional(t.Boolean()),
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Item']
            }
        })
        .put("/engineer/:id", ItemCtrl.updateEngineerItem, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                engineer_id: t.Nullable(t.Number()), // when remove engineer send null
                storage_id: t.Optional(t.Number()),
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
        .get("/serial/:serial_number", ItemCtrl.getItemBySerialNumber, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                serial_number: t.String()
            }),
            detail: {
                tags: ['Item']
            }
        })
}