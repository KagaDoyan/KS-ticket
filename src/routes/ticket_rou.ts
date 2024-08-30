import { t } from "elysia";
import { TicketCtrl } from "../controller/ticket_ctrl";
import { middleware } from "../middleware/auth";
import { action_status, ticket_status } from "@prisma/client";

export function TicketRoute(app: any) {
    return app
        .get("/", TicketCtrl.getallTicket, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            query: t.Object({
                limit: t.Numeric(),
                page: t.Numeric(),
                status: t.Optional(t.String()),
                search: t.Optional(t.String())
            }),
            detail: {
                tags: ['Ticket']
            }
        })
        .get("/dashboard", TicketCtrl.getTicketByDateRange, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            query: t.Object({
                start: t.String(),
                end: t.String(),
            }),
            detail: {
                tags: ['Ticket']
            }
        })
        .get("/:id", TicketCtrl.getTicketByID, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Ticket']
            }
        })
        .post("/open", TicketCtrl.openTicket, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                inc_number: t.String(),
                customer_id: t.Number(),
                shop_id: t.Number(),
                open_date: t.String(),
                open_time: t.String(),
                title: t.String(),
                description: t.String(),
                due_by: t.String(),
                sla_priority_level: t.String(),
                contact_name: t.String(),
                contact_tel: t.String(),
                assigned_to: t.String(),
                ticket_status: t.Enum(ticket_status),
                appointment_date: t.String(),
                appointment_time: t.String(),
                engineer_id: t.Number(),
            }),
            detail: {
                tags: ['Ticket']
            }
        })
        .put("/update/open/:id", TicketCtrl.updateOpenTicket, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            body: t.Object({
                inc_number: t.String(),
                customer_id: t.Number(),
                shop_id: t.Number(),
                open_date: t.String(),
                open_time: t.String(),
                title: t.String(),
                description: t.String(),
                due_by: t.String(),
                sla_priority_level: t.String(),
                contact_name: t.String(),
                contact_tel: t.String(),
                assigned_to: t.String(),
                ticket_status: t.Enum(ticket_status),
                appointment_date: t.String(),
                appointment_time: t.String(),
                engineer_id: t.Number(),
            }),
            detail: {
                tags: ['Ticket']
            }
        })
        .put("/update/close/:id", TicketCtrl.updateCloseTicket, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            body: t.Object({
                solution: t.String(),
                investigation: t.String(),
                close_description: t.String(),
                item_brand: t.String(),
                ticket_status: t.Enum(ticket_status),
                item_category: t.String(),
                item_model: t.String(),
                item_sn: t.String(),
                warranty_exp: t.Date(),
                resolve_status: t.BooleanString(),
                resolve_remark: t.Optional(t.String()),
                action: t.Enum(action_status),
                time_in: t.String(),
                time_out: t.String(),
                store_item: t.Any(),
                spare_item: t.Any(),
                images: t.Optional(t.Files()),
                delete_images: t.Optional(t.Any())
            }),
            detail: {
                tags: ['Ticket']
            }
        })
        .post("/update/returnItem/:id", TicketCtrl.updateReturnItem, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            body: t.Object({
                return_item: t.Any()
                // request
                // "return_item": [
                //     {
                //         id?: number,
                //         serial_number: string,
                //         category_id: number,
                //         brand_id: number,
                //         model_id: number,
                //         warranty_expiry_date?: any,
                //         inc_number: string,
                //         status: item_status,
                //         type: item_type,
                //         ticket_type: string, // store & spare
                //         created_by: number
                //     }
                // ]
            }),
            detail: {
                tags: ['Ticket']
            }
        })
        .delete("/spare/:id", TicketCtrl.deleteSpareitem, {
            beforeHandle : middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Ticket']
            }
        })
        .delete("/store/:id", TicketCtrl.deleteShopItem, {
            beforeHandle : middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Ticket']
            }
        })
        .delete("/:id" , TicketCtrl.deleteTicket, {
            beforeHandle : middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
            detail: {
                tags: ['Ticket']
            }
        })
        .get("/enigeer/:shop_id", TicketCtrl.getNearestEngineer, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                shop_id: t.Numeric()
            }),
            detail: {
                tags: ['Ticket']
            }
        })
}