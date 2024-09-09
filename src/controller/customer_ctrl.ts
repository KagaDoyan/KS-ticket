import { middleware } from "../middleware/auth"
import { CustomerSvc } from "../services/customer_svc"
import { response } from "./reponse"

export const CustomerCtrl = {
    createcustomer: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx)
        ctx.body.created_by = userID
        console.log("userID: " + userID);

        const data = await CustomerSvc.createCustome({ ...ctx.body })
        return response.SuccessResponse(ctx, data)
    },

    updateCustomer: async (ctx: any) => {
        const userID = await middleware.GetUserFromToken(ctx)
        ctx.body.created_by = userID
        const data = await CustomerSvc.updateCustome(ctx.params.id, ctx.body)
        return response.SuccessResponse(ctx, data)
    },

    deleteCustomer: async (ctx: any) => {
        // const userID = middleware.GetUserFromToken(ctx)
        // ctx.body.created_by = userID
        const data = await CustomerSvc.softDeleteCustome(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },

    getCustomerByID: async (ctx: any) => {
        const data = await CustomerSvc.getCustomerbyID(ctx.params.id)
        return response.SuccessResponse(ctx, data)
    },

    getAllCustomer: async (ctx: any) => {
        const data = await CustomerSvc.getallCustomer(ctx.query.limit, ctx.query.page, ctx.query.search)
        return response.SuccessResponse(ctx, data)
    },

    getAllCustomerNoFilter: async (ctx: any) => {
        const data = await CustomerSvc.getAllCustomerNoFilter()
        return response.SuccessResponse(ctx, data)
    },

    getCustomerOptions: async (ctx: any) => {
        const data = await CustomerSvc.getCustomerOptions()
        return response.SuccessResponse(ctx, data)
    }
}