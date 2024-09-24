import db from "../adapter.ts/database";
interface teamPayload {
    id?: number
    name: string
}
export const TeamSvc = {
    async getTeams() {
        const teams = await db.teams.findMany();
        return teams
    },
    async getTeam(id: number) {
        const team = await db.teams.findUnique({
            where: {
                id: id
            }
        });
        return team
    },
    async createTeam(payload: teamPayload) {
        const team = await db.teams.create({
            data: {
                team_name: payload.name
            }
        });
        return team
    },
    async updateTeam(id: number, payload: teamPayload) {
        const team = await db.teams.update({
            where: {
                id: id
            },
            data: {
                team_name: payload.name
            }
        });
        return team
    },
    async deleteTeam(id: number) {
        const team = await db.teams.delete({
            where: {
                id: id
            }
        });
        return team
    }   
}