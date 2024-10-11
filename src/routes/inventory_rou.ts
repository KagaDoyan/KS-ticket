import { t } from "elysia";
import { InventoryCtrl } from "../controller/inventory_ctrl";
import { middleware } from "../middleware/auth";

export function InventoryRoute(app: any) {
    return app
        .get("/", InventoryCtrl.getallInventory, {
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
                tags: ['Inventory']
            }
        })
        .get("/:id", InventoryCtrl.getInventoryByID, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Inventory']
            }
        })
        .post("/", InventoryCtrl.createInventory, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                model: t.String(),
                serial: t.String(),
                brand: t.String(),
                warranty: t.String(),
                sell_date: t.String(),
                buyer_name: t.String(),
                sell_price: t.Nullable(t.Numeric()),
                base_price: t.Nullable(t.Numeric()),
            }),
            detail: {
                tags: ['Inventory']
            }
        })
        .put("/:id", InventoryCtrl.updateInventory, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                model: t.String(),
                serial: t.String(),
                brand: t.String(),
                warranty: t.String(),
                sell_date: t.String(),
                buyer_name: t.String(),
                sell_price: t.Nullable(t.Numeric()),
                base_price: t.Nullable(t.Numeric()),
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Inventory']
            }
        })
        .delete("/:id", InventoryCtrl.deleteInventory, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Inventory']
            }
        })
        .get("/report", InventoryCtrl.report, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            query: t.Object({
                from: t.String(),
                to: t.String(),
                search: t.Optional(t.String()),
            }),
            detail: {
                tags: ['Inventory']
            }
        })
}