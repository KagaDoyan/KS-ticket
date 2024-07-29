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
        .get("/paginate", ProvinceCtrl.getallProvincepaginate, {
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
                tags: ['Province']
            }
        })
        .get("/:id", ProvinceCtrl.getProvinceByID, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
               tags: ['Province'] 
            }
        })
        .post("/", ProvinceCtrl.createProvince, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                name: t.String(),
                code: t.String(),
                priority_group_id: t.Numeric()
            }),
            detail: {
                tags: ['Province']
            }
        })
        .put("/:id", ProvinceCtrl.updateProvince, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                name: t.String(),
                code: t.String(),
                priority_group_id: t.Numeric()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Province']
            }
        })
        .delete("/:id", ProvinceCtrl.deleteProvince, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Province']
            }
        })
}