import { TeamSvc } from "../services/team_svc";
import { response } from "./reponse";

export const TeamCtrl = {
    async getTeams(ctx: any) {
        //paginate team filter
        const teams = await TeamSvc.getTeams(ctx.query.limit, ctx.query.page, ctx.query.search, ctx.query.customer_id);
        return teams
    },

    async getTeam(ctx: any) {
        const team = await TeamSvc.getTeam(ctx.params.id);
        return team
    },

    async createTeam(ctx: any) {
        const team = await TeamSvc.createTeam({ ...ctx.body });
        return team
    },

    async updateTeam(ctx: any) {
        const team = await TeamSvc.updateTeam(ctx.params.id, { ...ctx.body });
        return team
    },

    async deleteTeam(ctx: any) {
        const team = await TeamSvc.deleteTeam(ctx.params.id);
        return team
    },

    async getTeamOption(ctx: any) {
        const teams = await TeamSvc.getTeamOption(ctx.query.customer_id);
        return response.SuccessResponse(ctx, teams)
    }
}