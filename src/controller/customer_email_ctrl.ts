import { CustomerEmailSvc } from "../services/customer_email"
import { response } from "./reponse"

export const CustomerEmailCtrl = {
    async getCustomerEmail(ctx: any) {
        const data = await CustomerEmailSvc.getCustomerEmailAll(ctx.query.limit, ctx.query.page, ctx.query.search, ctx.query.brand, ctx.query.customer_id);
        return response.SuccessResponse(ctx, data)
    },
    async createCustomerEmail(ctx: any) {
        const data = await CustomerEmailSvc.CreateCustomerEmail(ctx.body);
        return response.SuccessResponse(ctx, data)
    },

    async updateCustomerEmail(ctx: any) {
        const data = await CustomerEmailSvc.UpdateCustomerEmail(ctx.params.id, ctx.body);
        return response.SuccessResponse(ctx, data)
    },

    async deleteCustomerEmail(ctx: any) {
        const data = await CustomerEmailSvc.DeleteCustomerEmail(ctx.params.id);
        return response.SuccessResponse(ctx, data)
    },

    async getCustomerEmailByID(ctx: any) {
        const data = await CustomerEmailSvc.getCustomerEmailByID(ctx.params.id);
        return response.SuccessResponse(ctx, data)
    }
}