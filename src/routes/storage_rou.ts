import { t } from "elysia";
import { StorageCtrl } from "../controller/storage_ctrl";
import { middleware } from "../middleware/auth";

export function StorageRoute(app: any) {
    return app
        .get("/", StorageCtrl.getallStorage, {
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
                tags: ['Storage']
            }
        })
        .get("/:id", StorageCtrl.getStorageByID, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric() 
            }),
            detail: {
                tags: ['Storage']
            }
        })
        .post("/", StorageCtrl.createStorage, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                name: t.String(),
                location: t.String(),
                latitude: t.Optional(t.String()),
                longitude: t.Optional(t.String()),
            }),
            detail: {
                tags: ['Storage']
            }
        })
        .put("/:id", StorageCtrl.updateStorage, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                name: t.String(),
                location: t.String(),
                latitude: t.Optional(t.String()),
                longitude: t.Optional(t.String()),
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Storage']
            }
        })
        .delete("/:id", StorageCtrl.deleteStorage, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Storage']
            }
        })
        .get("/option", StorageCtrl.getStorageOption, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ['Storage']
            }
        })
}