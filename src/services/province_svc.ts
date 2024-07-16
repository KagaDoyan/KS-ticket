import db from "../adapter.ts/database"

export const ProvinceSvc = {
    getallProvince: async () => {
        const province = await db.provinces.findMany()
        return province
    }
}