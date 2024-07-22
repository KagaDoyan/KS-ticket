import { t } from "elysia";
import { BrandCtrl } from "../controller/brand_ctrl";
import { middleware } from "../middleware/auth";

export function BrandRoute(app: any) {
    return app
        .get("/", BrandCtrl.getallBrand, {
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
                tags: ['Brand']
            }
        })
        .get("/:id", BrandCtrl.getBrandByID, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Brand']
            }
        })
        .post("/", BrandCtrl.createBrand, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                name: t.String(),
            }),
            detail: {
                tags: ['Brand']
            }
        })
        .put("/:id", BrandCtrl.updateBrand, {
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
                tags: ['Brand']
            }
        })
        .delete("/:id", BrandCtrl.deleteBrand, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Brand']
            }
        })
        .get("/option", BrandCtrl.getBrandOption, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ['Brand']
            }
        })
    }