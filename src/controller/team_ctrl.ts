import { TeamSvc } from "../services/team_svc";

export const TeamCtrl = {
    async getTeams(ctx: any) {
        //paginate team filter
        const teams = await TeamSvc.getTeams(ctx.query.limit, ctx.query.page, ctx.query.search);
        return teams
    },

    async getTeam(ctx: any) {
        const team = await TeamSvc.getTeam(ctx.params.id);
        return team
    },

    async createTeam(ctx: any) {
        const team = await TeamSvc.createTeam(ctx.request.body);
        return team
    },  

    async updateTeam(ctx: any) {        
        const team = await TeamSvc.updateTeam(ctx.params.id, ctx.request.body);
        return team
    },  

    async deleteTeam(ctx: any) {
        const team = await TeamSvc.deleteTeam(ctx.params.id);
        return team
    }
}