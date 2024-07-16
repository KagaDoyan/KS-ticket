import { t } from "elysia";
import { ModelCtrl } from "../controller/model_ctrl";
import { middleware } from "../middleware/auth";

export function ModelRoute(app: any) {
    return app
        .get("/", ModelCtrl.getallModel, {
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
                tags: ['Model']
            }
        })
        .get("/:id", ModelCtrl.getModelByID, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Model']
            }
        })
        .post("/", ModelCtrl.createModel, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                name: t.String(),
            }),
            detail: {
                tags: ['Model']
            }
        })
        .put("/:id", ModelCtrl.updateModel, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                name: t.String(),
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Model']
            }
        })
        .delete("/:id", ModelCtrl.deleteModel, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Model']
            }
        })
    }