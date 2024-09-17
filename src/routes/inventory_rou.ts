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
                warranty: t.String(),
                sell_date: t.String(),
                buyer_name: t.String(),
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
                warranty: t.String(),
                sell_date: t.String(),
                buyer_name: t.String(),
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
    }