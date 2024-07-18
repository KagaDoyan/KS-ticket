import { t } from "elysia";
import { PriorityGroupCtrl } from "../controller/priority_group_ctrl";
import { middleware } from "../middleware/auth";

export function PriorityGroupRoute(app: any) {
    return app
        .get("/", PriorityGroupCtrl.getallPriorityGroup, {
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
                tags: ['PriorityGroup']
            }
        })
        .get("/:id", PriorityGroupCtrl.getPriorityGroupByID, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['PriorityGroup']
            }
        })
        .post("/", PriorityGroupCtrl.createPriorityGroup, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                group_name: t.String(),
            }),
            detail: {
                tags: ['PriorityGroup']
            }
        })
        .put("/:id", PriorityGroupCtrl.updatePriorityGroup, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                group_name: t.String(),
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['PriorityGroup']
            }
        })
        .delete("/:id", PriorityGroupCtrl.deletePriorityGroup, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['PriorityGroup']
            }
        })
    }