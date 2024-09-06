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
                engineer: true,
                store_item: true,
                spare_item: true
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
            ticketReport.push({...ticket, SLA_overdue});
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
                ticket: true
            }
        });
        return {
            report: allItem
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
            storeReport.push({ ...item, location: store_location});
        }
        return {
            report: storeReport
        }
    }
}