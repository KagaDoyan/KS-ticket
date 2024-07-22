import { t } from "elysia";
import { CategoryCtrl } from "../controller/category_ctrl";
import { middleware } from "../middleware/auth";

export function CategoryRoute(app: any) {
    return app
        .get("/", CategoryCtrl.getallCategory, {
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
                tags: ['Category']
            }
        })
        .get("/:id", CategoryCtrl.getCategoryByID, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Category']
            }
        })
        .post("/", CategoryCtrl.createCategory, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                name: t.String(),
            }),
            detail: {
                tags: ['Category']
            }
        })
        .put("/:id", CategoryCtrl.updateCategory, {
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
                tags: ['Category']
            }
        })
        .delete("/:id", CategoryCtrl.deleteCategory, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Category']
            }
        })
        .get("/option", CategoryCtrl.getCategoryOption, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ['Category']
            }
        })
    }