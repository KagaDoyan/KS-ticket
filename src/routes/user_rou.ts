import { Elysia, t } from "elysia";
import { UserCtrl } from "../controller/user_ctrl";
import { middleware } from "../middleware/auth";

export function UserRoute(app: any) {
    return app
        .get("/", UserCtrl.getallUsers, {
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
                tags: ['User']
            }
        })
        .get("/id/:id", UserCtrl.getUserbyID, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ['User']
            }
        })
        .post("/", UserCtrl.createUser, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                email: t.String(),
                fullname: t.String(),
                password: t.String(),
                role: t.String(),
                customer_id: t.Optional(t.Nullable(t.Numeric()))
            }),
            detail: {
                tags: ['User']
            }
        })
        .put("/:id", UserCtrl.updateUser, {
            beforeHandle: middleware.IsAuth,
            body: t.Object({
                email: t.String(),
                fullname: t.String(),
                role: t.String(),
                customer_id: t.Optional(t.Nullable(t.Numeric()))
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['User']
            }
        })
        .post("/login", UserCtrl.Login, {
            body: t.Object({
                email: t.String(),
                password: t.String()
            }),
            detail: {
                tags: ['User']
            }
        })
        .get("/whoami", UserCtrl.whoami, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ['User']
            }
        })
        .delete("/:id", UserCtrl.softDeleteUser, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['User']
            }
        })
        .put("/password/:id", UserCtrl.updatePassword, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                password: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['User']
            }
        })
}