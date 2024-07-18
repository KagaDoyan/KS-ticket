import { t } from "elysia";
import { PriorityCtrl } from "../controller/priority_ctrl";
import { middleware } from "../middleware/auth";

export function PriorityRoute(app: any) {
    return app
        .get("/", PriorityCtrl.getallPriority, {
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
                tags: ['Priority']
            }
        })
        .get("/:id", PriorityCtrl.getPriorityByID, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Priority']
            }
        })
        .post("/", PriorityCtrl.createPriority, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                name: t.String(),
                time_sec: t.String(),
            }),
            detail: {
                tags: ['Priority']
            }
        })
        .put("/:id", PriorityCtrl.updatePriority, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                name: t.String(),
                time_sec: t.String(),
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Priority']
            }
        })
        .delete("/:id", PriorityCtrl.deletePriority, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Priority']
            }
        })
    }