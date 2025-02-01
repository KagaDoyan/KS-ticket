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
        .get("/option", NodeCtrl.getnodeoption, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
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
                provinceData: t.Optional(t.Nullable(t.Array(t.Object({
                    province_id: t.Numeric(),
                    node_time: t.Numeric()
                }))))
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
                provinceData: t.Optional(t.Nullable(t.Array(t.Object({
                    province_id: t.Numeric(),
                    node_time: t.Numeric()
                })))),
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
        .get("/with-engineer", NodeCtrl.getNodeWithActiveEngineer, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            query: t.Object({
                date: t.Optional(t.Nullable(t.String())),
                customer_id: t.Optional(t.Nullable(t.String()))
            }),
            detail: {
                tags: ['Node']
            }
        })
        .get("/engineer-count/:id", NodeCtrl.getEngineersTaskCountForNode, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            query: t.Object({
                date: t.Optional(t.Nullable(t.String()))
            }),
            detail: {
                tags: ['Node']
            }
        })
    }