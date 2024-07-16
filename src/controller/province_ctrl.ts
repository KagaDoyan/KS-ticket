import { ProvinceSvc } from "../services/province_svc"

export const ProvinceCtrl = {
    getallProvince: async () => {
        const province = await ProvinceSvc.getallProvince()
        return province
    }
}