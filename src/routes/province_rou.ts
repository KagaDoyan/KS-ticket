import { t } from "elysia";
import { ProvinceCtrl } from "../controller/province_ctrl";
import { middleware } from "../middleware/auth";

export function provinceRoute(app: any) {
    return app
        .get("/", ProvinceCtrl.getallProvince, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ['Province']
            }
        })
}