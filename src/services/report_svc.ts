import { Prisma } from "@prisma/client";
import db from "../adapter.ts/database";
import dayjs from "dayjs";
import { SecToTimeString } from "../utilities/sec_to_time_string";
import { startOfDay, endOfDay, parse } from 'date-fns'
import { log } from "node:console";

interface MA {
    updated_by: string;
    incNo: string; // Incident Number
    ticketNumber: string;
    brand: string;
    lastUpdated: string;
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
    engineerNode?: string; // Optional if no notes are provided
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
    node: string
    status: string
    used_by: string
    inc_no: string
    ticket_no: string
    remark: string
    updated_at: string
    item_type: string
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

interface EngineerKPI {
    ticket_date: string
    appointment_date: string
    time_in: string
    time_out: string
    engineer: string
    node: string
    ticket_number: string
    inc_number: string
    ticket_title: string
    shop_name: string
}

interface TicketKPI {
    ticket_date: string
    ticket_time: string
    ticket_number: string
    inc_number: string
    ticket_title: string
    category: string
    shop_name: string
    send_appointment: string
    send_mail: string
    time_in: string
    time_out: string
    ticket_status: string
    kpi_sla: string
    kpi_sla_status: string
    kpi_mail_appointment: any
    kpi_mail_appointment_status: string
    kpi_appointment: any
    kpi_appointment_status: string
    kpi_arrival: any
    kpi_arrival_status: string
    kpi_solving_under_90min: any
    kpi_solving_under_90min_status: string
    kpi_document_and_close_under_10min: any
    kpi_document_and_close_under_10min_status: string
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
                        status: {
                            in: ["return", "replace"]
                        }
                    },
                }
            }
        });
        let ticketReport: any = [];
        for (const ticket of allTicket) {
            const updated_by = await db.users.findUnique({
                where: {
                    id: ticket.updated_by
                }
            })
            let SLA_overdue: string = "";
            const timeSLA = new Date(ticket.due_by);
            if (ticket.ticket_status === "close") {
                const timeClose = new Date(`${ticket.close_date} ${ticket.close_time}:00`);
                SLA_overdue = timeClose > timeSLA ? "No" : "Yes";
            } else {
                const timeNow = new Date();
                SLA_overdue = timeNow > timeSLA ? "No" : "Yes";
            }
            // all date format as DD/MM/YYYY
            var ticketOnly: MA = {
                incNo: ticket.inc_number, // Incident Number
                lastUpdated: ticket.updated_at?.toDateString()!,
                updated_by: updated_by?.fullname!,
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
                appointmentDate: dayjs(ticket.appointment_date).format("DD/MM/YYYY"),
                appointmentTime: ticket.appointment_time,
                ticketStatus: ticket.ticket_status,
                ticketCloseTime: ticket.close_time,
                ticketCloseDate: ticket.close_date,
                engineerName: ticket.engineer?.name,
                engineerNode: ticket.engineer?.node?.name,
                solution: ticket.solution,
                recoveryTime: dayjs(ticket.due_by).format("DD/MM/YYYY HH:mm"), // Deadline for SLA (could also be Date if preferred)
                slaOverdue: SLA_overdue,
                item_brand: ticket.item_brand,
                item_category: ticket.item_category,
                item_model: ticket.item_model,
                item_sn: ticket.item_sn,
                warranty_exp: dayjs(ticket.warranty_exp).format("DD/MM/YYYY"),
                resloved: ticket.resolve_status,
                resolve_remark: ticket.resolve_remark,
                action: ticket.ticket_status === "close" ? "closed" : ticket.action,
                timeIn: ticket.time_in,
                timeOut: ticket.time_out,
                created_by: ticket.created_user.fullname,
                return_investigation: ticket.return_ticket?.investigation!,
                return_engineer: ticket.return_ticket?.engineer?.name ? ticket.return_ticket?.engineer?.name! + " " + ticket.return_ticket?.engineer?.lastname : "",
                return_solution: ticket.return_ticket?.solution ? ticket.return_ticket?.solution : "",
                return_time_in: ticket.return_ticket?.time_in ? dayjs(ticket.return_ticket?.time_in).format("DD/MM/YYYY HH:mm") : "",
                return_time_out: ticket.return_ticket?.time_out ? dayjs(ticket.return_ticket?.time_out).format("DD/MM/YYYY HH:mm") : ""
            }
            for (var i = 0; i <= 4; i++) {
                ticketOnly["storeDeviceCategory" + (i + 1)] = ticket.store_item[i]?.category ?? "";
                ticketOnly["storeDeviceBrand" + (i + 1)] = ticket.store_item[i]?.brand ?? "";
                ticketOnly["storeDeviceModel" + (i + 1)] = ticket.store_item[i]?.model ?? "";
                ticketOnly["storeDeviceSerial" + (i + 1)] = ticket.store_item[i]?.serial_number ?? "";
            }
            for (var i = 0; i <= 4; i++) {
                ticketOnly["spareDeviceCategory" + (i + 1)] = ticket.spare_item[i]?.category ?? "";
                ticketOnly["spareDeviceBrand" + (i + 1)] = ticket.spare_item[i]?.brand ?? "";
                ticketOnly["spareDeviceModel" + (i + 1)] = ticket.spare_item[i]?.model ?? "";
                ticketOnly["spareDeviceSerial" + (i + 1)] = ticket.spare_item[i]?.serial_number ?? "";
            }
            for (var i = 0; i <= 4; i++) {
                ticketOnly["returnDeviceCategory" + (i + 1)] = ticket.return_item[i]?.category ?? "";
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
                node: item.engineers_id ? item.engineer?.node?.name! : "",
                inc_no: item.ticket?.inc_number!,
                ticket_no: item.ticket?.ticket_number!,
                remark: item.Remark!,
                updated_at: dayjs(item.updated_at).format("DD/MM/YYYY HH:mm:ss"),
                item_type: item.item_type ? item.item_type : ""
            }
            invetory.push(itemOnly);
        }
        return {
            report: invetory
        }
    },

    reportStoreBrokenPart: async (from: string, to: string, brand_name: string) => {
        const whereCondition: Prisma.itemsWhereInput = {
            deleted_at: null,
            status: "repair",
            ticket: {
                open_date: {
                    gte: new Date(from).toISOString(),
                    lte: new Date(to).toISOString()
                }
            }
        }
        if (brand_name) {
            whereCondition.customer = {
                fullname: {
                    equals: brand_name
                }
            }
        }
        let storeItem = await db.items.findMany({
            where: whereCondition,
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
                ticket_date: dayjs(item.ticket?.appointment_date, "YYYY-MM-DD").format("DD/MM/YYYY"),
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
    },

    reportEngineerKPI: async (from: string, to: string, brand_name: string) => {
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
                shop: true,
                engineer: {
                    include: {
                        node: true,
                    }
                },
                customer: true,
                created_user: true,
            }
        });
        let engineerKPI: EngineerKPI[] = []
        for (const ticket of allTicket) {
            var engineerOnly: EngineerKPI = {
                ticket_date: dayjs(ticket.open_date).format("DD/MM/YYYY"),
                appointment_date: dayjs(ticket.appointment_date).format("DD/MM/YYYY") + " " + ticket.appointment_time,
                time_in: dayjs(ticket.time_in).format("DD/MM/YYYY HH:mm:ss"),
                time_out: dayjs(ticket.time_out).format("DD/MM/YYYY HH:mm:ss"),
                engineer: ticket.engineer.name + " " + ticket.engineer.lastname,
                node: ticket.engineer?.node?.name ? ticket.engineer?.node?.name : "",
                ticket_number: ticket.ticket_number,
                inc_number: ticket.inc_number,
                ticket_title: ticket.title,
                shop_name: ticket.shop.shop_number + " - " + ticket.shop.shop_name,
            }
            engineerKPI.push(engineerOnly);
        }
        return {
            report: engineerKPI
        }
    },

    reportTicketKPI: async (from: string, to: string, brand_name: string) => {
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
                prioritie: {
                    include: {
                        priority_group: true
                    }
                },
                shop: {
                    include: {
                        province: true
                    }
                },
                engineer: {
                    include: {
                        node: {
                            include: {
                                node_on_province: {
                                    include: {
                                        provinces: true
                                    }
                                }
                            }
                        },
                    }
                },
                customer: true,
                created_user: true,
            }
        });

        let ticketKPI: TicketKPI[] = []
        for (const ticket of allTicket) {
            var nodetime = ticket.engineer?.node?.node_on_province?.find((item) => item.province_id == ticket.shop?.province?.id)?.node_time
            if (ticket.engineer.out_source && nodetime) {
                nodetime = nodetime + 30
            }

            // if (ticket.inc_number.includes("INC079836")) {
            //     console.log(JSON.stringify(ticket.engineer, null, 2))
            // }


            // Set seconds to 00 for all dates
            var openDate = new Date(ticket.open_date + " " + ticket.open_time);
            if (ticket.is_pending && ticket.leave_pending_time) {
                openDate = new Date(ticket.leave_pending_time);
            }
            openDate.setSeconds(0);

            var DueBy = new Date(ticket.due_by);
            if (ticket.is_pending && ticket.leave_pending_time) {
                if (ticket.prioritie?.time_sec) {
                    DueBy = new Date(openDate.getTime() + (Number(ticket.prioritie.time_sec || 0) * 1000));
                }
            }
            DueBy.setSeconds(0);

            var send_close = new Date(ticket.send_close!);
            send_close.setSeconds(0);

            var send_appointment = new Date(ticket.send_appointment!);
            send_appointment.setSeconds(0);

            var kpi_mail_appointment: any
            var kpi_mail_appointment_status: string
            // kpi kpi_mail_appointment base on send appointment and open date time diff
            kpi_mail_appointment = ticket.send_appointment ? timeDiffInMinutes(send_appointment, openDate) : "N/A"
            kpi_mail_appointment_status = kpi_mail_appointment == "N/A" ? "N/A" : kpi_mail_appointment < 15 ? "PASS" : "FAIL"

            var kpi_appointment: any
            var kpi_appointment_status: string
            // kpi kpi_appointment base on appointment date time diff
            var appointment_date = new Date(ticket.appointment_date + " " + ticket.appointment_time);
            appointment_date.setSeconds(0);
            kpi_appointment = ticket.appointment_date ? timeDiffInMinutes(appointment_date, openDate) : "N/A"
            kpi_appointment_status = kpi_appointment == "N/A" ? "N/A" : kpi_appointment <= nodetime! ? "PASS" : "FAIL"

            // if (ticket.inc_number.includes("INC079836")) {
            //     console.log("================================================")
            //     console.log("KPI Appointment:", kpi_appointment)
            //     console.log("Node Time:", nodetime)
            //     console.log("Appointment Date:", appointment_date)
            //     console.log("Open Date:", openDate)
            //     console.log("================================================")
            // }

            var kpi_arrival: any
            var kpi_arrival_status: string
            // kpi kpi_arrival base on arrival date time diff
            var timeArrival = new Date(ticket.time_in!)
            timeArrival.setSeconds(0);

            kpi_arrival = timeArrival ? timeDiffInMinutes(timeArrival, appointment_date) : "N/A"
            kpi_arrival_status = kpi_arrival == "N/A" ? "N/A" : truncateToMinutes(timeArrival) <= truncateToMinutes(appointment_date) ? "PASS" : "FAIL"

            var kpi_solving_under_90min: any
            var kpi_solving_under_90min_status: string
            // kpi kpi_solving_under_90min base on time out date time diff
            var timeOut = new Date(ticket.time_out!)
            timeOut.setSeconds(0);
            kpi_solving_under_90min = timeOut ? timeDiffInMinutes(timeOut, timeArrival) : "N/A"
            kpi_solving_under_90min_status = kpi_solving_under_90min == "N/A" ? "N/A" : kpi_solving_under_90min < 90 ? "PASS" : "FAIL"

            var kpi_document_and_close_under_10min
            var kpi_document_and_close_under_10min_status
            // kpi kpi_document_and_close_under_10min base on time out date time diff
            kpi_document_and_close_under_10min = timeOut && ticket.send_close ? timeDiffInMinutes(send_close, timeOut) : "N/A"
            kpi_document_and_close_under_10min_status = kpi_document_and_close_under_10min == "N/A" ? "N/A" : kpi_document_and_close_under_10min < 10 ? "PASS" : "FAIL"

            var kpi_sla: any
            var kpi_sla_status: string
            // koi koi_sla base on time out date time diff
            var closedate: Date | null = new Date(ticket.close_date + " " + ticket.close_time);
            if (ticket.ticket_status != "close") {
                closedate = null
            }
            if (ticket.ticket_status == "oncall" || ticket.ticket_status == "spare") {
                closedate = timeOut
            }
            closedate?.setSeconds(0);

            kpi_sla = closedate ? timeDiffInMinutes(closedate, DueBy) : "N/A"
            kpi_sla_status = kpi_sla == "N/A" ? "N/A" : truncateToMinutes(closedate) <= truncateToMinutes(DueBy) ? "PASS" : "FAIL"

            var ticketOnly: TicketKPI = {
                ticket_date: dayjs(ticket.open_date).format("DD/MM/YYYY"),
                ticket_time: ticket.open_time,
                ticket_number: ticket.ticket_number,
                inc_number: ticket.inc_number,
                ticket_title: ticket.title,
                category: ticket.item_category ? ticket.item_category : "",
                shop_name: ticket.shop.shop_number + " - " + ticket.shop.shop_name,
                send_appointment: ticket.send_appointment ? dayjs(ticket.send_appointment).format("DD/MM/YYYY HH:mm:ss") : "",
                send_mail: ticket.send_close ? dayjs(ticket.send_close).format("DD/MM/YYYY HH:mm:ss") : "",
                time_in: dayjs(ticket.time_in).format("DD/MM/YYYY HH:mm:ss"),
                time_out: dayjs(ticket.time_out).format("DD/MM/YYYY HH:mm:ss"),
                ticket_status: ticket.ticket_status,
                kpi_sla: kpi_sla,
                kpi_sla_status: kpi_sla_status,
                kpi_mail_appointment: kpi_mail_appointment,
                kpi_mail_appointment_status: kpi_mail_appointment_status,
                kpi_appointment: kpi_appointment,
                kpi_appointment_status: kpi_appointment_status,
                kpi_arrival: kpi_arrival,
                kpi_arrival_status: kpi_arrival_status,
                kpi_solving_under_90min: kpi_solving_under_90min,
                kpi_solving_under_90min_status: kpi_solving_under_90min_status,
                kpi_document_and_close_under_10min: kpi_document_and_close_under_10min,
                kpi_document_and_close_under_10min_status: kpi_document_and_close_under_10min_status
            }
            ticketKPI.push(ticketOnly);
        }
        return {
            report: ticketKPI
        }
    },

    ReportReturn: async (from: string, to: string, brand_name?: string) => {
        try {
            let serialNumbers: string[] | undefined;
            // Convert `from` and `to` to cover the full day range
            const fromDate = startOfDay(new Date(from));
            const toDate = endOfDay(new Date(to));
            // Step 1: Fetch serial numbers if brand_name is provided
            if (brand_name) {
                const itemSerialNumbers = await db.items.findMany({
                    where: {
                        customer: {
                            fullname: {
                                equals: brand_name,
                            }
                        },
                    },
                    select: {
                        serial_number: true, // Only fetch serial_number
                    },
                });

                // Extract serial numbers into an array
                serialNumbers = itemSerialNumbers.map((item) => item.serial_number);
            }

            // Step 2: Construct the where condition for return_items
            const whereCondition: Prisma.return_itemsWhereInput = {
                created_at: {
                    gte: fromDate,
                    lte: toDate,
                },
                deleted_at: null,
                status: {
                    equals: "return",
                },
                item_type: {
                    equals: "store",
                },
                ...(serialNumbers && { serial_number: { in: serialNumbers } }), // Filter by serial_number only if provided
            };
            // console.log(whereCondition);

            // Step 3: Fetch return_items based on the where condition
            const returnItems = await db.return_items.findMany({
                where: whereCondition,
                include: {
                    ticket: {
                        include: {
                            shop: true
                        }
                    },
                },
            });

            // Step 4: Process or return the fetched data
            let storeReport: broken[] = [];
            for (const item of returnItems) {
                let returnItem = await db.items.findFirst({
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
                if (!returnItem) continue;
                var itemOnly: broken = {
                    inc_no: item.ticket?.inc_number!,
                    ticket_date: dayjs(item.ticket?.appointment_date, "YYYY-MM-DD").format("DD/MM/YYYY"),
                    ticket_time: item.ticket?.appointment_time!,
                    store_id: item.ticket?.shop.shop_number!,
                    store_name: item.ticket?.shop.shop_name!,
                    ticket_title: item.ticket?.title!,
                    location: returnItem.engineers_id ? "Node" : returnItem.storage?.name!,
                    brand: returnItem.brand.name,
                    model: returnItem.model.name,
                    serial: returnItem.serial_number,
                    category: returnItem.category.name,
                    warranty: returnItem.warranty_expiry_date ? dayjs(returnItem.warranty_expiry_date).format("YYYY-MM-DD") : "",
                    status: returnItem.status,
                    updated_at: dayjs(returnItem.updated_at).format("DD/MM/YYYY HH:mm:ss"),
                    remark: returnItem.Remark!,
                    condition: ""
                }
                storeReport.push(itemOnly);
            }
            return {
                report: storeReport
            }
        } catch (error) {
            return null
        }
    }
}


function timeDiffInMinutes(date1: Date, date2: Date) {
    let difference = (date1.valueOf() - date2.valueOf())
    let diffminute = difference / (1000 * 60)

    return Math.floor(diffminute);
}

const truncateToMinutes = (date) => new Date(date.setSeconds(0, 0));