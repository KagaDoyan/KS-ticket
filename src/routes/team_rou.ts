import { t } from "elysia";
import { TeamCtrl } from "../controller/team_ctrl";
import { middleware } from "../middleware/auth";

export function TeamRou(app: any) {
    return app
        .get("/", TeamCtrl.getTeams, {
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
                tags: ['Team']
            }
        })
        .get("/:id", TeamCtrl.getTeam, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Team']
            }
        })
        .post("/", TeamCtrl.createTeam, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                team_name: t.String(),
            }),
            detail: {
                tags: ['Team']
            }
        })
        .put("/:id", TeamCtrl.updateTeam, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            body: t.Object({
                team_name: t.String(),
            }),
            detail: {
                tags: ['Team']
            }
        })
        .delete("/:id", TeamCtrl.deleteTeam, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Team']
            }
        })
        .get("/option", TeamCtrl.getTeamOption, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ['Team']
            }
        })
}