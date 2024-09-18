import { Elysia, t } from "elysia";
import { EngineerCtrl } from "../controller/engineer_ctrl";
import { middleware } from "../middleware/auth";

export function EngineerRoute(app: any) {
    return app
        .get("/", EngineerCtrl.getallEngineer, {
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
                tags: ['Engineer']
            }
        })
        .get("/:id", EngineerCtrl.getEngineerByID, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Engineer']
            }
        })
        .post("/", EngineerCtrl.createEngineer, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                name: t.String(),
                lastname: t.String(),
                phone: t.String(),
                line_name: t.String(),
                latitude: t.String(),
                longitude: t.String(),
                province_id: t.Array(t.Numeric()),
                node: t.Optional(t.String()),
                node_id: t.Numeric(),
                email: t.String(),
                password: t.String(),
            }),
            detail: {
                tags: ['Engineer']
            }
        })
        .put("/:id", EngineerCtrl.updateEngineer, {
            body: t.Object({
                name: t.String(),
                lastname: t.String(),
                phone: t.String(),
                line_name: t.String(),
                latitude: t.String(),
                longitude: t.String(),
                province_id: t.Array(t.Numeric()),
                node: t.Optional(t.String()),
                node_id: t.Numeric(),
                email: t.Optional(t.String()),
                password: t.Optional(t.String()),
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Engineer']
            }
        })
        .delete("/:id", EngineerCtrl.deleteEngineer, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Engineer']
            }
        })
        .get("/option/location", EngineerCtrl.getEngineerOrderByLocation, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            query: t.Object({
                latitude: t.Optional(t.String()),
                longitude: t.Optional(t.String())
            }),
            detail: {
                tags: ['Engineer']
            }
        })
}