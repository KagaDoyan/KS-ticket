import { Prisma } from "@prisma/client";
import db from "../adapter.ts/database";

export const reportSvc = {
    reportMA: async (from: string, to: string) => {
        let allTicket = await db.tickets.findMany({
            where: {
                deleted_at: null,
                appointment_date: {
                    gte: from,
                    lte: to,
                }
            },
            include: {
                shop: true,
                engineer: true
            }
        });
        let ticketReport: any = [];
        for(const ticket of allTicket) {
            let SLA_overdue: string = "";
            const timeSLA = new Date(ticket.due_by);
            if(ticket.ticket_status === "close"){
                const timeClose = new Date(`${ticket.close_date} ${ticket.close_time}:00`);
                SLA_overdue = timeClose > timeSLA ? "No" : "Yes";
            }else{
                const timeNow = new Date();
                SLA_overdue = timeNow > timeSLA ? "No" : "Yes";
            }
            let { shop, engineer, ...ticketOnly } = ticket;
            ticketOnly["engineer"] = ticket.engineer.name + " " + ticket.engineer.lastname;
            ticketOnly["engineer_node"] = ticket.engineer.node;
            ticketOnly["shop"] = ticket.shop.shop_name;
            ticketOnly["SLA_overdue"] = SLA_overdue;
            ticketReport.push(ticketOnly);
        }
        return {
            report: ticketReport
        }
    },

    reportInventory: async () => {
        let allItem = await db.items.findMany({
            where: {
                deleted_at: null
            },
            include: {
                engineer: true,
                category: true,
                brand: true,
                model: true,
                ticket: {
                    include: {
                        shop: true,
                        customer: true,
                    }
                }
            }
        });
        let invetory: any = []
        for (const item of allItem) {
            let {engineer, category, brand, model, ticket , ...itemOnly} = item;
            itemOnly["engineer"] = item.engineer?.name + " " + item.engineer?.lastname;
            itemOnly["category"] = item.category.name;
            itemOnly["brand"] = item.brand.name;
            itemOnly["model"] = item.model.name;
            itemOnly["owner"] = item.ticket?.customer.fullname;
            itemOnly["shop"] = item.ticket?.shop.shop_name;
            itemOnly["inc_number"] = item.ticket?.inc_number || "";
            itemOnly["remark"] = item.ticket?.resolve_remark;
            invetory.push(itemOnly);
        }
        return {
            report: invetory
        }
    },

    reportStoreBrokenPart: async (from: string, to: string) => {
        let storeItem = await db.store_items.findMany({
            where: {
                deleted_at: null,
                ticket: {
                    deleted_at: null,
                    appointment_date: {
                        gte: from,
                        lte: to,
                    },
                }
            },
            include: {
                ticket: true
            }
        });
        let storeReport: any = [];
        for(const item of storeItem){
            let brokenItem = await db.items.findFirst({
                where: {
                    serial_number: item.serial_number,
                    deleted_at: null
                }
            })
            if(!brokenItem) continue;
            console.log(brokenItem.engineers_id);
            let store_location = brokenItem.engineers_id ? "Node" : "Warehouse"; 
            let {ticket , ...itemOnly} = item;
            itemOnly["ticket_date"] = item.ticket.appointment_date;
            itemOnly["ticket_time"] = item.ticket.appointment_time;
            itemOnly["location"] = store_location;
            itemOnly["inc_number"] = item.ticket.inc_number;
            itemOnly["ticket_title"] = item.ticket.title;
            storeReport.push(itemOnly);
        }
        return {
            report: storeReport
        }
    }
}