import { Prisma } from "@prisma/client";
import db from "../adapter.ts/database";

interface MA {
    brand: string;
    ticketTitle: string;
    ticketDescription: string;
    incNo: string; // Incident Number
    ticketNumber: string;
    assignedTo: string;
    ticketDate: string; // Consider using Date type if you're handling date objects
    ticketTime: string; // Consider using Date type if you're handling time objects
    storeName: string;
    storeContactPhone: string;
    ticketStatus: string;
    ticketStatusDetail?: string; // Optional field, only for pending status
    ticketCloseTime?: string; // Optional if the ticket is not yet closed
    ticketCloseDate?: string; // Optional if the ticket is not yet closed
    engineerName: string;
    engineerNote?: string; // Optional if no notes are provided
    appointmentTime?: string; // Optional if no appointment is scheduled
    appointmentDate?: string; // Optional if no appointment is scheduled
    solution?: string | null; // Optional if no solution is provided yet
    slaPriority: string; // SLA Priority
    recoveryTime: string; // Deadline for SLA (could also be Date if preferred)
    slaOverdue: string; // Whether it was closed within SLA (Yes/No as boolean)
    lastUpdated?: string; // Date when the ticket was last updated
    action: string | null;
    storeDeviceBrand1?: string;
    storeDeviceModel1?: string;
    storeDeviceSerial1?: string;
    storeDeviceBrand2?: string;
    storeDeviceModel2?: string;
    storeDeviceSerial2?: string;
    storeDeviceBrand3?: string;
    storeDeviceModel3?: string;
    storeDeviceSerial3?: string;
    storeDeviceBrand4?: string;
    storeDeviceModel4?: string;
    storeDeviceSerial4?: string;
    storeDeviceBrand5?: string;
    storeDeviceModel5?: string;
    storeDeviceSerial5?: string;
    spareDeviceBrand1?: string;
    spareDeviceModel1?: string;
    spareDeviceSerial1?: string;
    spareDeviceBrand2?: string;
    spareDeviceModel2?: string;
    spareDeviceSerial2?: string;
    spareDeviceBrand3?: string;
    spareDeviceModel3?: string;
    spareDeviceSerial3?: string;
    spareDeviceBrand4?: string;
    spareDeviceModel4?: string;
    spareDeviceSerial4?: string;
    spareDeviceBrand5?: string;
    spareDeviceModel5?: string;
    spareDeviceSerial5?: string;
}

export const reportSvc = {
    reportMA: async (from: string, to: string) => {
        let allTicket = await db.tickets.findMany({
            where: {
                deleted_at: null,
                open_date: {
                    gte: from,
                    lte: to,
                }
            },
            include: {
                shop: true,
                engineer: {
                    include: {
                        node: true,
                    }
                },
                customer: true,
                store_item: {
                    where: {
                        deleted_at: null
                    },
                },
                spare_item: {
                    where: {
                        deleted_at: null
                    },
                }
            }
        });
        let ticketReport: any = [];
        for (const ticket of allTicket) {

            let SLA_overdue: string = "";
            const timeSLA = new Date(ticket.due_by);
            if (ticket.ticket_status === "close") {
                const timeClose = new Date(`${ticket.close_date} ${ticket.close_time}:00`);
                SLA_overdue = timeClose > timeSLA ? "No" : "Yes";
            } else {
                const timeNow = new Date();
                SLA_overdue = timeNow > timeSLA ? "No" : "Yes";
            }
            var ticketOnly: MA = {
                brand: ticket.customer.fullname,
                ticketTitle: ticket.title,
                assignedTo: ticket.assigned_to,
                ticketDescription: ticket.description,
                incNo: ticket.inc_number == "n/a" ? ticket.ticket_number : ticket.inc_number,
                ticketNumber: ticket.ticket_number,
                ticketDate: ticket.appointment_date,
                ticketTime: ticket.appointment_time,
                storeName: ticket.shop.shop_number + " " + ticket.shop.shop_name,
                storeContactPhone: ticket.shop.phone,
                ticketStatus: ticket.ticket_status,
                engineerName: ticket.engineer.name + " " + ticket.engineer.lastname,
                slaPriority: ticket.sla_priority_level,
                recoveryTime: ticket.due_by,
                slaOverdue: SLA_overdue,
                appointmentDate: ticket.appointment_date,
                appointmentTime: ticket.appointment_time,
                solution: ticket.solution,
                action: ticket.action,
            }
            for (var i = 1; i <= 5; i++) {
                ticketOnly["storeDeviceBrand" + i] = ticket.store_item[i]?.brand ?? "";
                ticketOnly["storeDeviceModel" + i] = ticket.store_item[i]?.model ?? "";
                ticketOnly["storeDeviceSerial" + i] = ticket.store_item[i]?.serial_number ?? "";
            }
            for (var i = 1; i <= 5; i++) {
                ticketOnly["spareDeviceBrand" + i] = ticket.spare_item[i]?.brand ?? "";
                ticketOnly["spareDeviceModel" + i] = ticket.spare_item[i]?.model ?? "";
                ticketOnly["spareDeviceSerial" + i] = ticket.spare_item[i]?.serial_number ?? "";
            }
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
            let { engineer, category, brand, model, ticket, ...itemOnly } = item;
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
        for (const item of storeItem) {
            let brokenItem = await db.items.findFirst({
                where: {
                    serial_number: item.serial_number,
                    deleted_at: null
                }
            })
            if (!brokenItem) continue;
            console.log(brokenItem.engineers_id);
            let store_location = brokenItem.engineers_id ? "Node" : "Warehouse";
            let { ticket, ...itemOnly } = item;
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