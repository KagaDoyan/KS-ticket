import { t } from "elysia";
import { NodeCtrl } from "../controller/node_ctrl";
import { middleware } from "../middleware/auth";

export function NodeRoute(app: any) {
    return app
        .get("/", NodeCtrl.getallnode, {
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
                tags: ['Node']
            }
        })
        .get("/:id", NodeCtrl.getnodeByID, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Node']
            }
        })
        .post("/", NodeCtrl.createnode, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                name: t.String(),
                province_id: t.Array(t.Numeric()),
            }),
            detail: {
                tags: ['Node']
            }
        })
        .put("/:id", NodeCtrl.updatenode, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                name: t.String(),
                province_id: t.Array(t.Numeric()),
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Node']
            }
        })
        .delete("/:id", NodeCtrl.deletenode, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Node']
            }
        })
    }