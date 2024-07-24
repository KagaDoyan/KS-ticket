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
        .post("/open", TicketCtrl.openTicket, {
            beforeHandle: middleware.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                inc_number: t.String(),
                customer_id: t.Number(),
                store_id: t.Number(),
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
    }