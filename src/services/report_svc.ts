import { Prisma } from "@prisma/client";
import db from "../adapter.ts/database";
import dayjs from "dayjs";
import { SecToTimeString } from "../utilities/sec_to_time_string";

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
    slaPriorityTime: string | undefined; // SLA Priority
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
    return_engineer?: string;
    return_investigation?: string;
    return_solution?: string;
    return_time_in?: string;
    return_time_out?: string;
    returnDeviceBrand1?: string;
    returnDeviceModel1?: string;
    returnDeviceSerial1?: string;
    returnDeviceBrand2?: string;
    returnDeviceModel2?: string;
    returnDeviceSerial2?: string;
    returnDeviceBrand3?: string;
    returnDeviceModel3?: string;
    returnDeviceSerial3?: string;
    returnDeviceBrand4?: string;
    returnDeviceModel4?: string;
    returnDeviceSerial4?: string;
    returnDeviceBrand5?: string;
    returnDeviceModel5?: string;
    returnDeviceSerial5?: string;
}

interface inventory {
    category: string
    brand: string
    model: string
    serial: string
    owner: string
    condition: string
    location: string
    status: string
    used_by: string
    inc_no: string
    ticket_no: string
    remark: string
    updated_at: string
}

interface broken {
    inc_no: string
    ticket_date: string
    ticket_time: string
    store_id: string
    store_name: string
    ticket_title: string
    category: string
    brand: string
    model: string
    serial: string
    warranty: string
    location: string
    status: string
    updated_at: string
    condition: string
    remark: string
}

export const reportSvc = {
    reportMA: async (from: string, to: string, brand_name: string) => {
        var wharecondition: Prisma.ticketsWhereInput = {
            open_date: {
                gte: from,
                lte: to
            },
            deleted_at: null
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
                return_ticket: {
                    include: {
                        engineer: true
                    }
                },
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
                },
                return_item: {
                    where: {
                        deleted_at: null,
                        status: "return"
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
                slaPriority: ticket.prioritie?.name,
                slaPriorityTime: SecToTimeString(parseInt(ticket.prioritie?.time_sec!)),
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
                action: ticket.ticket_status === "close" ? "closed" : ticket.action,
                timeIn: ticket.time_in,
                timeOut: ticket.time_out,
                created_by: ticket.created_user.fullname,
                return_investigation: ticket.return_ticket?.investigation!,
                return_engineer: ticket.return_ticket?.engineer?.name!+" "+ ticket.return_ticket?.engineer?.lastname,
                return_solution: ticket.return_ticket?.solution!,
                return_time_in: ticket.return_ticket?.time_in!,
                return_time_out: ticket.return_ticket?.time_out!
            }
            for (var i = 0; i <= 4; i++) {
                ticketOnly["storeDeviceBrand" + (i + 1)] = ticket.store_item[i]?.brand ?? "";
                ticketOnly["storeDeviceModel" + (i + 1)] = ticket.store_item[i]?.model ?? "";
                ticketOnly["storeDeviceSerial" + (i + 1)] = ticket.store_item[i]?.serial_number ?? "";
            }
            for (var i = 0; i <= 4; i++) {
                ticketOnly["spareDeviceBrand" + (i + 1)] = ticket.spare_item[i]?.brand ?? "";
                ticketOnly["spareDeviceModel" + (i + 1)] = ticket.spare_item[i]?.model ?? "";
                ticketOnly["spareDeviceSerial" + (i + 1)] = ticket.spare_item[i]?.serial_number ?? "";
            }
            for (var i = 0; i <= 4; i++) {
                ticketOnly["returnDeviceBrand" + (i + 1)] = ticket.return_item[i]?.brand ?? "";
                ticketOnly["returnDeviceModel" + (i + 1)] = ticket.return_item[i]?.model ?? "";
                ticketOnly["returnDeviceSerial" + (i + 1)] = ticket.return_item[i]?.serial_number ?? "";
            }
            ticketReport.push(ticketOnly);
        }
        return {
            report: ticketReport
        }
    },

    reportInventory: async (brand_name: string) => {
        var whereCondition: Prisma.itemsWhereInput = {
            deleted_at: null,
            status: {
                not: "repair"
            }
        }
        if (brand_name) {
            whereCondition = {
                AND: [
                    whereCondition,
                    {
                        customer: {
                            fullname: {
                                equals: brand_name
                            }
                        }
                    }
                ]
            }
        }
        let allItem = await db.items.findMany({
            where: whereCondition,
            include: {
                engineer: {
                    include: {
                        node: true
                    }
                },
                category: true,
                brand: true,
                model: true,
                ticket: {
                    include: {
                        shop: true,
                        customer: true,
                    }
                },
                customer: true
            }
        });
        let invetory: inventory[] = []
        for (const item of allItem) {
            var itemOnly: inventory = {
                category: item.category.name,
                brand: item.brand.name,
                model: item.model.name,
                serial: item.serial_number,
                owner: item.customer?.fullname!,
                condition: item.status == "repair" ? "broken" : "good",
                status: item.status,
                location: item.status == "spare" ? item.shop_number! : (item.engineers_id ? item.engineer?.node?.name! : "in stock"),
                used_by: item.engineers_id ? item.engineer?.name! : "",
                inc_no: item.ticket?.inc_number!,
                ticket_no: item.ticket?.ticket_number!,
                remark: item.Remark!,
                updated_at: dayjs(item.updated_at).format("DD/MM/YYYY HH:mm:ss"),
            }
            invetory.push(itemOnly);
        }
        return {
            report: invetory
        }
    },

    reportStoreBrokenPart: async (from: string, to: string) => {
        let storeItem = await db.items.findMany({
            where: {
                deleted_at: null,
                status: "repair",
                // updated_at: {
                //     gte: new Date(from),
                //     lte: new Date(to)
                // }
            },
            include: {
                ticket: {
                    include: {
                        shop: true
                    }
                }
            }
        });
        let storeReport: broken[] = [];
        for (const item of storeItem) {
            let brokenItem = await db.items.findFirst({
                where: {
                    serial_number: item.serial_number,
                    deleted_at: null
                },
                include: {
                    storage: true,
                    category: true,
                    brand: true,
                    model: true
                }
            })
            if (!brokenItem) continue;
            var itemOnly: broken = {
                inc_no: item.ticket?.inc_number!,
                ticket_date: item.ticket?.appointment_date!,
                ticket_time: item.ticket?.appointment_time!,
                store_id: item.ticket?.shop.shop_number!,
                store_name: item.ticket?.shop.shop_name!,
                ticket_title: item.ticket?.title!,
                location: brokenItem.engineers_id ? "Node" : brokenItem.storage?.name!,
                brand: brokenItem.brand.name,
                model: brokenItem.model.name,
                serial: brokenItem.serial_number,
                category: brokenItem.category.name,
                warranty: brokenItem.warranty_expiry_date ? dayjs(brokenItem.warranty_expiry_date).format("YYYY-MM-DD") : "",
                status: item.status,
                updated_at: dayjs(item.updated_at).format("DD/MM/YYYY HH:mm:ss"),
                remark: item.Remark!,
                condition: item.status == "repair" ? "broken" : "good",
            }
            storeReport.push(itemOnly);
        }
        return {
            report: storeReport
        }
    }
}