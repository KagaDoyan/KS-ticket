import { Prisma } from "@prisma/client";
import db from "../adapter.ts/database";
import dayjs from "dayjs";

interface MA {
    incNo: string; // Incident Number
    ticketNumber: string;
    brand: string;
    storeNumber: string;
    storeName: string;
    storeContactPhone: string;
    contactName: string;
    ticketTitle: string;
    ticketDescription: string;
    assignedTo: string;
    slaPriorityGroup: string | undefined;
    slaPriority: string | undefined; // SLA Priority
    ticketopenDate: string; // Consider using Date type if you're handling date objects
    ticketopenTime: string; // Consider using Date type if you're handling time objects
    appointmentDate?: string; // Optional if no appointment is scheduled
    appointmentTime?: string; // Optional if no appointment is scheduled
    ticketStatus: string;
    ticketStatusDetail?: string; // Optional field, only for pending status
    ticketCloseDate?: string | null; // Optional if the ticket is not yet closed
    ticketCloseTime?: string | null; // Optional if the ticket is not yet closed
    engineerName: string;
    engineerNote?: string; // Optional if no notes are provided
    solution?: string | null; // Optional if no solution is provided yet
    recoveryTime: string; // Deadline for SLA (could also be Date if preferred)
    slaOverdue: string; // Whether it was closed within SLA (Yes/No as boolean)
    item_brand?: string | null;
    item_category?: string | null;
    item_model?: string | null;
    item_sn?: string | null;
    warranty_exp?: string | null;
    resloved: boolean | null;
    resolve_remark?: string | null;
    action: string | null;
    timeIn?: string | null;
    timeOut?: string | null;
    created_by: string;
    close_date?: string | null;
    close_time?: string | null;

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
    reportMA: async (from: string, to: string, brand_name: string) => {
        var wharecondition: Prisma.ticketsWhereInput = {
            open_date: {
                gte: from,
                lte: to
            }
        }

        if (brand_name) {
            wharecondition = {
                AND: [
                    wharecondition,
                    {
                        customer: {
                            fullname: {
                                contains: brand_name
                            }
                        }
                    }
                ]
            }
        }
        let allTicket = await db.tickets.findMany({
            where: wharecondition,
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
                },
                created_user: true,
                prioritie: {
                    include: {
                        priority_group: true
                    }
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
                incNo: ticket.inc_number, // Incident Number
                ticketNumber: ticket.ticket_number,
                brand: ticket.customer.fullname,
                storeNumber: ticket.shop.shop_number,
                storeName: ticket.shop.shop_name,
                storeContactPhone: ticket.contact_tel,
                contactName: ticket.contact_name,
                ticketTitle: ticket.title,
                ticketDescription: ticket.description,
                assignedTo: ticket.assigned_to,
                slaPriorityGroup: ticket.prioritie?.priority_group.group_name,
                slaPriority: ticket.sla_priority_level,
                ticketopenDate: ticket.open_date,
                ticketopenTime: ticket.open_time,
                appointmentDate: ticket.appointment_date,
                appointmentTime: ticket.appointment_time,
                ticketStatus: ticket.ticket_status,
                ticketCloseTime: ticket.close_time,
                ticketCloseDate: ticket.close_date,
                engineerName: ticket.engineer?.name,
                solution: ticket.solution,
                recoveryTime: dayjs(ticket.due_by).format("YYYY-MM-DD HH:mm"), // Deadline for SLA (could also be Date if preferred)
                slaOverdue: SLA_overdue,
                item_brand: ticket.item_brand,
                item_category: ticket.item_category,
                item_model: ticket.item_model,
                item_sn: ticket.item_sn,
                warranty_exp: dayjs(ticket.warranty_exp).format("YYYY-MM-DD"),
                resloved: ticket.resolve_status,
                resolve_remark: ticket.resolve_remark,
                action: ticket.action,
                timeIn: ticket.time_in,
                timeOut: ticket.time_out,
                created_by: ticket.created_user.fullname,
                close_date: ticket.close_date,
                close_time: ticket.close_time

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