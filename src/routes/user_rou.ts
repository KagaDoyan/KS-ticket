import { Elysia, t } from "elysia";
import { UserCtrl } from "../controller/user_ctrl";
import { middleware } from "../middleware/auth";

export function UserRoute(app:any) {
    return app
        .get("/", UserCtrl.getallUsers)
        .get("/id/:id", UserCtrl.getUserbyID)
        .post("/", UserCtrl.createUser, { beforeHandle: middleware.IsAuth })
        .post("/login", UserCtrl.Login, {
            body: t.Object({
                email: t.String(),
                password: t.String()
            })
        })
        .get("/whoami", UserCtrl.whoami, { beforeHandle: middleware.IsAuth, })
}