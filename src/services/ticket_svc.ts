import { ticket_status, Prisma, item_status, item_type } from "@prisma/client";
import db from "../adapter.ts/database";
import { unlink } from "node:fs/promises";
import crypto from 'crypto';
import * as turf from '@turf/turf';
import sharp from 'sharp';
import nodemailer from 'nodemailer';
import { SecToTimeString } from "../utilities/sec_to_time_string";
import dayjs from "dayjs";
import { Line_svc } from "./line_svc";

interface itemList {
    id?: number,
    serial_number: string,
    category_id: number,
    brand_id: number,
    model_id: number,
    warranty_expiry_date?: any,
    inc_number: string,
    status: item_status,
    type: item_type,
    ticket_type: string,
    created_by: number
}

interface returnItem {
    investigation?: string,
    solution?: string,
    item_brand?: string,
    item_category?: string,
    item_model?: string,
    item_sn?: string,
    warranty_exp?: any,
    resolve_status: boolean,
    resolve_remark?: string,
    action?: string,
    time_in?: any,
    time_out?: any,
    items: string,
    created_by: number,
    close_date: string,
    close_time: string,
    images?: File[],
    delete_images?: string[]
}

interface ticketPayload {
    id?: number,
    priority_id?: number,
    inc_number: string,
    ticket_number?: string,
    customer_id: number,
    shop_id: number,
    open_date: string,
    open_time: string,
    close_date?: string,
    close_time?: string,
    title: string,
    description: string,
    due_by: string,
    sla_priority_level: string,
    contact_name: string,
    contact_tel: string,
    assigned_to: string,
    created_by: number,
    updated_by: number,
    ticket_status: ticket_status,
    appointment_date: string
    appointment_time: string
    engineer_id: number,
    solution?: string,
    investigation?: string,
    close_description?: string,
    item_brand?: string,
    item_category?: string,
    item_model?: string,
    item_sn?: string,
    warranty_exp?: Date,
    resolve_status: boolean,
    resolve_remark?: string,
    action?: string,
    time_in?: any,
    time_out?: any,
    store_item?: string,
    spare_item?: string,
    return_item?: string,
    images?: File[],
    delete_images?: string[]
}

interface mailRemark {
    remark?: string,
}

async function generateRandomNumber(length: number) {
    const numbers = '0123456789';
    let ticketNumber = '';
    const numbersLength = numbers.length;
    for (let i = 0; i < length; i++) {
        ticketNumber += numbers.charAt(Math.floor(Math.random() * numbersLength));
    }
    const checkTicketNumber = await db.tickets.findFirst({
        where: {
            deleted_at: null,
            ticket_number: ticketNumber
        }
    });
    if (checkTicketNumber) {
        return generateRandomNumber(length);
    }
    return ticketNumber;
}

async function generateNameForImage(name: string) {
    let ext = "." + name.split(".")[1];
    let uuid = crypto.randomUUID();
    let imageName = uuid + ext;
    let checkImage = await db.ticket_images.findFirst({
        where: {
            deleted_at: null,
            name: imageName
        }
    });
    if (checkImage) {
        return generateNameForImage(name);
    }
    return imageName;
}

export const ticketSvc = {
    getAllTicket: async (limit: number, page: number, status: ticket_status, search: string) => {
        let whereCondition: Prisma.ticketsWhereInput = {
            deleted_at: null,
            ...(status && { ticket_status: status })
        }

        if (search) {
            whereCondition.AND = [
                {
                    OR: [
                        { ticket_status: status },
                        { title: { contains: search } }
                    ]
                }
            ]
        }
        const total_ticket = await db.tickets.count({ where: whereCondition });
        const totalPages = Math.ceil(total_ticket / limit);
        const offset = (page - 1) * limit;
        const tickets = await db.tickets.findMany({
            where: whereCondition,
            skip: offset,
            take: limit,
            orderBy: {
                id: "desc"
            },
            include: {
                created_user: true,
                engineer: true,
                shop: true
            }
        });
        return {
            page: page,
            limit: limit,
            total_page: totalPages,
            total_rows: total_ticket,
            data: tickets
        }
    },

    openTicket: async (payload: ticketPayload) => {
        const customer = await db.customers.findUnique({
            where: {
                id: payload.customer_id
            }
        })
        let ticketNumber: string = await generateRandomNumber(5);
        ticketNumber = customer?.shortname + ticketNumber
        const ticket = await db.tickets.create({
            data: {
                inc_number: payload.inc_number,
                ticket_number: ticketNumber,
                customer_id: payload.customer_id,
                shop_id: payload.shop_id,
                open_date: payload.open_date,
                open_time: payload.open_time,
                priority_id: payload.priority_id,
                close_date: payload.close_date,
                close_time: payload.close_time,
                title: payload.title,
                description: payload.description?.replace(/\n\s*\n/g, '\n'),
                due_by: payload.due_by,
                sla_priority_level: payload.sla_priority_level,
                contact_name: payload.contact_name,
                contact_tel: payload.contact_tel,
                assigned_to: payload.assigned_to,
                created_by: payload.created_by,
                updated_by: payload.updated_by,
                ticket_status: payload.ticket_status,
                appointment_date: payload.appointment_date,
                appointment_time: payload.appointment_time,
                engineer_id: payload.engineer_id,
                solution: payload.solution,
                investigation: payload.investigation,
                close_description: payload.close_description,
                item_brand: payload.item_brand,
                item_category: payload.item_category,
                item_model: payload.item_model,
                item_sn: payload.item_sn,
                warranty_exp: payload.warranty_exp || null,
                resolve_status: payload.resolve_status,
                resolve_remark: payload.resolve_remark,
                action: payload.action,
                time_in: payload.time_in,
                time_out: payload.time_out
            }
        });
        // send line notification
        const ticketData = await db.tickets.findUnique({
            where: {
                id: ticket.id
            },
            include: {
                shop: true,
                prioritie: {
                    include: {
                        priority_group: true
                    }
                },
                customer: true
            }
        })

        if (customer?.line_open) {
            var message = `Open Case | ${ticketData?.sla_priority_level} | Assgined | ${(ticketData?.inc_number === 'n/a' ? ticketData?.ticket_number : ticketData?.inc_number)} | ${ticketData?.shop.shop_number}-${ticketData?.shop.shop_name} | ${ticketData?.item_category} | ${ticketData?.title} | ${ticketData?.ticket_number} | ${dayjs(new Date()).format('HH:mm')}\n\n`
            message += `Incident (เลขที่ใบแจ้งงาน): ${(ticketData?.inc_number === 'n/a' ? ticketData?.ticket_number : ticketData?.inc_number)}\n\n`
            message += `Contact (ผู้แจ้ง): ${ticketData?.contact_name}\n\n`
            message += `Phone (เบอร์โทร): ${ticketData?.contact_tel}\n\n`
            message += `Store (สาขา): ${ticketData?.shop.shop_number}-${ticketData?.shop.shop_name}\n\n`
            message += `Description (รายละเอียด):\n${ticketData?.description}\n\n`
            message += `Assigned To (ผู้เปีดงานให้กับ): ${ticketData?.assigned_to}\n\n`
            message += `Incident open date/time (วันและเวลาที่เปิดงาน): ${dayjs(ticketData?.open_date).format('DD/MM/YYYY')} ${ticketData?.open_time}\n\n`
            message += `Estimated Resolving Time (วันและเวลาแก้ไขโดยประมาณ): ${ticketData?.sla_priority_level} ${ticketData?.prioritie?.priority_group.group_name} ${ticketData?.prioritie?.time_sec ? SecToTimeString(parseInt(ticketData?.prioritie?.time_sec)) : ''}\n\n`
            message += `DueBy Date (วันและเวลาครบกําหนด): ${dayjs(ticketData?.due_by).format('DD/MM/YYYY HH:mm')}\n\n`

            const line_groups = customer.line_open.split(',');
            for (const group of line_groups) {
                Line_svc.sendMessage(group, message);
            }
        }
        return ticket;
    },

    updateOpenTicket: async (id: number, payload: ticketPayload) => {
        const ticket = await db.tickets.update({
            where: {
                id: id
            },
            data: {
                inc_number: payload.inc_number,
                customer_id: payload.customer_id,
                shop_id: payload.shop_id,
                open_date: payload.open_date,
                open_time: payload.open_time,
                title: payload.title,
                priority_id: payload.priority_id,
                description: payload.description?.replace(/\n\s*\n/g, '\n'),
                due_by: payload.due_by,
                sla_priority_level: payload.sla_priority_level,
                contact_name: payload.contact_name,
                contact_tel: payload.contact_tel,
                assigned_to: payload.assigned_to,
                updated_by: payload.updated_by,
                ticket_status: payload.ticket_status,
                appointment_date: payload.appointment_date,
                appointment_time: payload.appointment_time,
                engineer_id: payload.engineer_id
            }
        });
        return ticket;
    },

    updateCloseTicket: async (id: number, payload: ticketPayload, files: any) => {
        const ticket = await db.tickets.update({
            where: {
                id: id
            },
            data: {
                ticket_status: payload.ticket_status,
                close_date: payload.close_date,
                close_time: payload.close_time,
                solution: payload.solution?.replace(/\n\s*\n/g, '\n'),
                investigation: payload.investigation?.replace(/\n\s*\n/g, '\n'),
                close_description: payload.close_description,
                item_brand: payload.item_brand,
                item_category: payload.item_category,
                item_model: payload.item_model,
                item_sn: payload.item_sn,
                warranty_exp: payload.warranty_exp ? new Date(payload.warranty_exp) : null,
                resolve_status: payload.resolve_status,
                resolve_remark: payload.resolve_remark && payload.resolve_remark != 'null' ? payload.resolve_remark.replace(/\n\s*\n/g, '\n') : "",
                action: payload.action,
                time_in: payload.time_in,
                time_out: payload.time_out,
                updated_by: payload.updated_by
            },
            include: {
                shop: true,
            }
        });
        if (payload.store_item) {
            let storeItem = JSON.parse(payload.store_item);
            for (const item of storeItem) {
                let item_sn = item.serial_number;
                let checkExistStore = await db.store_items.findFirst({
                    where: {
                        deleted_at: null,
                        ticket_id: id,
                        serial_number: item_sn,
                    }
                });
                if (checkExistStore) continue;
                let checkItem = await db.items.findFirst({
                    where: {
                        deleted_at: null,
                        serial_number: item_sn
                    },
                    include: {
                        brand: true,
                        category: true,
                        model: true
                    }
                });
                if (checkItem) {
                    await db.store_items.create({
                        data: {
                            ticket_id: id,
                            brand: checkItem.brand.name,
                            category: checkItem.category.name,
                            model: checkItem.model.name,
                            serial_number: checkItem.serial_number,
                            warranty_exp: checkItem.warranty_expiry_date || null,
                            status: item.status,
                            created_by: payload.created_by
                        }
                    });

                    await db.items.update({
                        where: {
                            id: checkItem.id
                        },
                        data: {
                            status: item.status,
                            engineers_id: ticket.engineer_id,
                            type: item.type,
                            ticket_id: id,
                            updated_at: new Date()
                        }
                    })

                    continue;
                }

                let newItem = await db.items.create({
                    data: {
                        customer_id: ticket.customer_id,
                        serial_number: item.serial_number,
                        category_id: item.category_id,
                        brand_id: item.brand_id,
                        model_id: item.model_id,
                        engineers_id: ticket.engineer_id,
                        warranty_expiry_date: item.warranty_expiry_date || null,
                        inc_number: item.inc_number,
                        status: item.status,
                        type: item.type,
                        created_by: payload.created_by,
                        ticket_id: id,
                        updated_at: new Date()
                    },
                    include: {
                        brand: true,
                        category: true,
                        model: true
                    }
                });

                await db.store_items.create({
                    data: {
                        ticket_id: id,
                        brand: newItem.brand.name,
                        category: newItem.category.name,
                        model: newItem.model.name,
                        serial_number: item_sn,
                        warranty_exp: newItem.warranty_expiry_date || null,
                        status: item.status,
                        created_by: payload.created_by,
                    }
                });
            }
        }

        if (payload.spare_item) {
            let spareItem = JSON.parse(payload.spare_item);
            for (const item of spareItem) {
                let shop = ticket.shop.shop_number + '-' + ticket.shop.shop_name
                let item_sn = item.serial_number;
                let checkExistSpare = await db.spare_items.findFirst({
                    where: {
                        deleted_at: null,
                        ticket_id: id,
                        serial_number: item_sn,
                    }
                });
                let checkItem = await db.items.findFirst({
                    where: {
                        deleted_at: null,
                        serial_number: item_sn
                    },
                    include: {
                        brand: true,
                        category: true,
                        model: true
                    }
                });
                if (checkExistSpare) {
                    await db.spare_items.update({
                        where: {
                            id: checkExistSpare.id
                        },
                        data: {
                            status: item.status,
                        },
                    });
                    await db.items.update({
                        where: {
                            id: checkItem?.id
                        },
                        data: {
                            status: item.status,
                            shop_number: item.status == "spare" ? shop : null,
                            updated_at: new Date()
                        }
                    })
                    continue;
                }

                if (checkItem) {
                    await db.spare_items.create({
                        data: {
                            ticket_id: id,
                            brand: checkItem.brand.name,
                            category: checkItem.category.name,
                            model: checkItem.model.name,
                            serial_number: item_sn,
                            warranty_exp: checkItem.warranty_expiry_date || null,
                            status: item.status,
                            created_by: payload.created_by
                        }
                    });

                    await db.items.update({
                        where: {
                            id: checkItem.id
                        },
                        data: {
                            status: item.status,
                            engineers_id: ticket.engineer_id,
                            type: item.type,
                            ticket_id: id,
                            shop_number: item.status == "spare" ? shop : null,
                            updated_at: new Date()
                        }
                    })

                    continue;
                }

                let newItem = await db.items.create({
                    data: {
                        serial_number: item.serial_number,
                        category_id: item.category_id,
                        brand_id: item.brand_id,
                        model_id: item.model_id,
                        engineers_id: ticket.engineer_id,
                        warranty_expiry_date: item.warranty_expiry_date || null,
                        inc_number: item.inc_number,
                        status: item.status,
                        type: item.type,
                        created_by: payload.created_by,
                        shop_number: item.status == "spare" ? shop : null,
                        ticket_id: id,
                        updated_at: new Date()
                    },
                    include: {
                        brand: true,
                        category: true,
                        model: true
                    }
                });

                await db.spare_items.create({
                    data: {
                        ticket_id: id,
                        brand: newItem.brand.name,
                        category: newItem.category.name,
                        model: newItem.model.name,
                        serial_number: item_sn,
                        warranty_exp: newItem.warranty_expiry_date || null,
                        status: item.status,
                        created_by: payload.created_by
                    }
                });
            }
        }

        // Upload image
        const images = payload.images as File[];
        if (images != null && images.length != 0) {
            for (const image of images) {
                let imageName = await generateNameForImage(image.name);
                // let imageType = imageName.split('.')[1].toLowerCase();
                // Process the image to reduce file
                // const buffer = await image.arrayBuffer();
                // let resizedImageBuffer;
                // if(imageType === 'jpg' || imageType === 'jpeg') {
                //     resizedImageBuffer = await sharp(Buffer.from(buffer)).jpeg({ quality: 30 }).toBuffer();
                // }
                // else if(imageType === 'png') {
                //     resizedImageBuffer = await sharp(Buffer.from(buffer)).png({ quality: 30 }).toBuffer();
                // }
                // else if(imageType === 'webp') {
                //     resizedImageBuffer = await sharp(Buffer.from(buffer)).webp({ quality: 30 }).toBuffer();
                // }
                await Bun.write(`files/` + imageName, image);
                await db.ticket_images.create({
                    data: {
                        ticket_id: id,
                        name: imageName,
                        path: "/image/" + imageName,
                        created_by: payload.created_by
                    }
                });
            }
        }

        // Delete File
        if (payload.delete_images != null && payload.delete_images.length != 0) {
            let deleteImages = typeof payload.delete_images === 'string' ? [payload.delete_images] : payload.delete_images;
            for (const imageName of deleteImages) {
                let checkImage = await db.ticket_images.findFirst({
                    where: {
                        name: imageName,
                        deleted_at: null
                    },
                });
                if (!checkImage) continue;
                await unlink(`files/` + imageName);
                await db.ticket_images.update({
                    where: {
                        id: checkImage.id,
                        deleted_at: null
                    },
                    data: {
                        deleted_at: new Date()
                    }
                });
            }
        }

        return ticket;
    },

    updateReturnItem: async (id: number, payload: returnItem) => {
        if (payload.items == null || payload.items.length === 0) {
            return { message: "No Return Item list to add" };
        }

        return await db.$transaction(async (prisma) => {
            let ticket = await prisma.tickets.findFirst({
                where: {
                    id: id,
                    deleted_at: null
                },
                include: {
                    shop: true
                }
            });
            if (!ticket) return { message: "No Ticket data" };

            let items = JSON.parse(payload.items);

            for (const item of items) {
                let checkExistReturn = await prisma.return_items.findFirst({
                    where: {
                        deleted_at: null,
                        ticket_id: id,
                        serial_number: item.serial_number,
                    }
                });
                let selectItem = await prisma.items.findFirst({
                    where: {
                        deleted_at: null,
                        serial_number: item.serial_number
                    },
                    include: {
                        brand: true,
                        category: true,
                        model: true
                    }
                });

                if (selectItem) {
                    let updateItemStatus = (item.type === "inside" && item.status === "return") ? "in_stock" : item.status;

                    if (checkExistReturn) {
                        await prisma.return_items.update({
                            where: {
                                id: checkExistReturn.id,
                            },
                            data: {
                                status: item.status
                            }
                        });

                        let item_ticket_id = (item.type === "inside" && item.status === "return") ? null : ticket.id;
                        await prisma.items.update({
                            where: {
                                id: selectItem.id,
                            },
                            data: {
                                status: updateItemStatus,
                                ticket_id: item_ticket_id ? item_ticket_id : null,
                                shop_number: updateItemStatus == "in_stock" ? null : ticket.shop.shop_number + '-' + ticket.shop.shop_name,
                                engineers_id: ticket.engineer_id,
                                updated_at: new Date()
                            }
                        });
                        continue;
                    }

                    await prisma.return_items.create({
                        data: {
                            ticket_id: id,
                            brand: selectItem.brand.name,
                            category: selectItem.category.name,
                            model: selectItem.model.name,
                            serial_number: item.serial_number,
                            warranty_exp: item.warranty_expiry_date || null,
                            status: item.status,
                            created_by: payload.created_by,
                            engineer_id: ticket.engineer_id,
                            item_type: item.type === "inside" ? "spare" : "store"
                        }
                    });

                    await prisma.items.update({
                        where: {
                            id: selectItem.id,
                        },
                        data: {
                            status: updateItemStatus,
                            engineers_id: ticket.engineer_id,
                            updated_at: new Date(),
                            ...(selectItem.type === "inside" && { ticket_id: null })
                        }
                    });
                    continue;
                }

                if (item.ticket_type === "store") {
                    let newItem = await prisma.items.create({
                        data: {
                            serial_number: item.serial_number,
                            category_id: item.category_id,
                            brand_id: item.brand_id,
                            model_id: item.model_id,
                            engineers_id: ticket.engineer_id,
                            warranty_expiry_date: item.warranty_expiry_date || null,
                            inc_number: item.inc_number,
                            status: item.status,
                            type: item.type,
                            created_by: payload.created_by,
                            shop_number: ticket.shop.shop_number,
                            customer_id: ticket.customer_id,
                            updated_at: new Date()
                        },
                        include: {
                            brand: true,
                            category: true,
                            model: true
                        }
                    });

                    await prisma.return_items.create({
                        data: {
                            ticket_id: id,
                            brand: newItem.brand.name,
                            category: newItem.category.name,
                            model: newItem.model.name,
                            serial_number: item.serial_number,
                            warranty_exp: newItem.warranty_expiry_date || null,
                            status: newItem.status,
                            created_by: payload.created_by,
                            engineer_id: ticket.engineer_id,
                            item_type: item.type === "inside" ? "spare" : "store"
                        }
                    });
                }
            }

            const return_ticket_data = await prisma.return_ticket.findFirst({
                where: {
                    ticket_id: id
                }
            });

            if (!return_ticket_data) {
                await prisma.return_ticket.create({
                    data: {
                        ticket_id: id,
                        investigation: payload.investigation?.replace(/\n\s*\n/g, '\n'),
                        solution: payload.solution?.replace(/\n\s*\n/g, '\n'),
                        item_brand: payload.item_brand,
                        item_category: payload.item_category,
                        item_model: payload.item_model,
                        item_sn: payload.item_sn,
                        warranty_exp: payload.warranty_exp ? new Date(payload.warranty_exp) : null,
                        resolve_status: payload.resolve_status,
                        resolve_remark: payload.resolve_remark && payload.resolve_remark != 'null' ? payload.resolve_remark : "",
                        action: payload.action,
                        time_in: payload.time_in,
                        time_out: payload.time_out,
                    }
                });
            } else {
                await prisma.return_ticket.update({
                    where: {
                        id: return_ticket_data.id
                    },
                    data: {
                        investigation: payload.investigation,
                        solution: payload.solution,
                        item_brand: payload.item_brand,
                        item_category: payload.item_category,
                        item_model: payload.item_model,
                        item_sn: payload.item_sn,
                        warranty_exp: payload.warranty_exp ? new Date(payload.warranty_exp) : null,
                        resolve_status: payload.resolve_status,
                        resolve_remark: payload.resolve_remark,
                        action: payload.action,
                        time_in: payload.time_in,
                        time_out: payload.time_out,
                    }
                });
            }

            await prisma.tickets.update({
                data: {
                    ticket_status: 'close',
                    close_date: payload.close_date,
                    close_time: payload.close_time
                },
                where: {
                    id: id,
                    deleted_at: null
                }
            });

            const images = payload.images as File[];
            if (images != null && images.length != 0) {
                for (const image of images) {
                    let imageName = await generateNameForImage(image.name);
                    // let imageType = imageName.split('.')[1].toLowerCase();
                    // Process the image to reduce file
                    // const buffer = await image.arrayBuffer();
                    // let resizedImageBuffer;
                    // if(imageType === 'jpg' || imageType === 'jpeg') {
                    //     resizedImageBuffer = await sharp(Buffer.from(buffer)).jpeg({ quality: 30 }).toBuffer();
                    // }
                    // else if(imageType === 'png') {
                    //     resizedImageBuffer = await sharp(Buffer.from(buffer)).png({ quality: 30 }).toBuffer();
                    // }
                    // else if(imageType === 'webp') {
                    //     resizedImageBuffer = await sharp(Buffer.from(buffer)).webp({ quality: 30 }).toBuffer();
                    // }
                    await Bun.write(`files/` + imageName, image);
                    await prisma.return_ticket_images.create({
                        data: {
                            ticket_id: id,
                            name: imageName,
                            path: "/image/" + imageName,
                            created_by: payload.created_by
                        }
                    });
                }
            }

            if (payload.delete_images != null && payload.delete_images.length != 0) {
                let deleteImages = typeof payload.delete_images === 'string' ? [payload.delete_images] : payload.delete_images;
                for (const imageName of deleteImages) {
                    let checkImage = await prisma.return_ticket_images.findFirst({
                        where: {
                            name: imageName,
                            deleted_at: null
                        },
                    });
                    if (!checkImage) continue;
                    await unlink(`files/` + imageName);
                    await prisma.return_ticket_images.update({
                        where: {
                            id: checkImage.id,
                            deleted_at: null
                        },
                        data: {
                            deleted_at: new Date()
                        }
                    });
                }
            }

            return { message: "Add return list complete" };
        });
    },

    getTicketByID: async (id: number) => {
        const ticket = await db.tickets.findUnique({
            where: {
                id: id
            },
            include: {
                return_ticket: true,
                shop: true,
                engineer: {
                    include: {
                        node: true
                    }
                },
                customer: {
                    include: {
                        mail_signature: true
                    }
                },
                store_item: {
                    where: {
                        deleted_at: null
                    }
                },
                spare_item: {
                    where: {
                        deleted_at: null
                    }
                },
                return_item: {
                    where: {
                        deleted_at: null
                    }
                },
                ticket_image: {
                    where: {
                        deleted_at: null
                    }
                },
                return_ticket_images: {
                    where: {
                        deleted_at: null
                    }
                },
                prioritie: true
            }
        });
        return ticket;
    },

    deleteShopitem: async (id: number, user_id: number) => {
        const ticket = await db.store_items.update({
            where: {
                id: id
            },
            data: {
                deleted_at: new Date(),
                deleted_by: user_id,
            }
        });
        return ticket;
    },

    deleteSpareitem: async (id: number, user_id: number) => {
        const ticket = await db.spare_items.update({
            where: {
                id: id
            },
            data: {
                deleted_at: new Date(),
                deleted_by: user_id,
            }
        });
        return ticket;
    },

    getTicketByDateRange: async (start: string, end: string, brand_name: string) => {
        var wharecondition: Prisma.ticketsWhereInput = {
            open_date: {
                gte: start,
                lte: end
            },
            deleted_at: null
        }

        if (brand_name) {
            wharecondition = {
                AND: [
                    wharecondition,
                    {
                        customer: {
                            shortname: {
                                in: brand_name.split(",")
                            }
                        }
                    }
                ]
            }
        }
        const tickets = await db.tickets.findMany({
            where: wharecondition,
            include: {
                created_user: true,
                engineer: true,
                customer: true,
                shop: true
            }
        });
        return tickets;
    },

    softDeleteTicket: async (id: number, user_id: number) => {
        const ticket = await db.tickets.update({
            where: {
                id: id
            },
            data: {
                deleted_at: new Date(),
                updated_by: user_id,
            }
        });
        return ticket;
    },

    getEngineerThatNearShop: async (shop_id: number) => {
        const shop = await db.shops.findFirst({
            where: {
                id: shop_id,
                AND: [
                    { longitude: { not: '' } },
                    { latitude: { not: '' } }
                ],
            }
        });
        const engineers = await db.engineers.findMany({
            where: {
                deleted_at: null,
            }
        });
        const engineerPoints: any = [];
        const engineerNoPoints: any = [];
        if (!shop) {
            for (const item of engineers) {
                const openTicket = await db.tickets.count({
                    where: {
                        engineer_id: item.id,
                        ticket_status: { not: 'close' },
                        deleted_at: null
                    }
                })
                if (item.latitude && item.longitude) {
                    engineerPoints.push({
                        point: turf.point([Number(item.longitude), Number(item.latitude)]),
                        id: item.id,
                        name: item.name,
                        lastname: item.lastname,
                        open_ticket: openTicket
                    });
                    continue;
                }
                engineerNoPoints.push({
                    id: item.id,
                    name: item.name,
                    lastname: item.lastname,
                    distance: 0,
                    open_ticket: openTicket
                });
            }
            return engineerNoPoints
        };
        for (const item of engineers) {
            const openTicket = await db.tickets.count({
                where: {
                    engineer_id: item.id,
                    ticket_status: { not: 'close' },
                    deleted_at: null
                }
            })
            if (item.latitude && item.longitude) {
                engineerPoints.push({
                    point: turf.point([Number(item.longitude), Number(item.latitude)]),
                    id: item.id,
                    name: item.name,
                    lastname: item.lastname,
                    open_ticket: openTicket
                });
                continue;
            }
            engineerNoPoints.push({
                id: item.id,
                name: item.name,
                lastname: item.lastname,
                distance: 0,
                open_ticket: openTicket
            });
        }
        if (engineerPoints.length < 0) {
            return engineerNoPoints;
        }
        const shopPoint = turf.point([Number(shop.longitude), Number(shop.latitude)]);
        // Calculate the distance from the shop point to each engineer
        const engineerWithDistance = engineerPoints.map(shop => {
            const distance = turf.distance(shopPoint, shop.point, { units: 'kilometers' });
            return { ...shop, distance: Math.ceil(parseFloat(distance.toFixed(2))) };
        });
        // Sort engineer by distance (ascending)
        engineerWithDistance.sort((a, b) => a.distance - b.distance);
        let engineerList = engineerWithDistance.map(({ point, ...engineer }) => engineer);
        if (engineerNoPoints.length > 0) {
            engineerList = [...engineerList, ...engineerNoPoints]
        }
        return engineerList;
    },

    sendMail: async (id: number) => {
        const ticket = await db.tickets.findFirst({
            where: {
                id: id
            },
            include: {
                shop: true,
                engineer: true,
                customer: true,
                ticket_image: {
                    where: {
                        deleted_at: null
                    }
                },
                store_item: {
                    where: {
                        deleted_at: null
                    }
                },
                spare_item: {
                    where: {
                        deleted_at: null
                    }
                }
            }
        });

        if (!ticket) return { message: "No Ticket Data" }
        const cc = await db.mail_recipient.findMany({
            where: {
                customer_id: ticket.customer_id
            }
        })
        // Set email content
        let status_title = ""
        if (ticket.ticket_status == "close") {
            status_title = "Resolved Case";
        } else if (ticket.ticket_status == "spare") {
            status_title = "Install Spare";
        }

        const deviceListClean = ticket.store_item.filter((element) => element);
        const replaceDeviceListClean = ticket.spare_item.filter((element) => element);

        const oldDeviceLabel = "   เก่า<br>";
        const newDeviceLabel = "   ใหม่<br>";

        const deviceListCleanMapped = deviceListClean.map((element) => `• ${element.category} ${element.brand} ${element.model} s/n: ${element.serial_number} ${oldDeviceLabel}`);
        const replaceDeviceListCleanMapped = replaceDeviceListClean.map((element) => `• ${element.category} ${element.brand} ${element.model} s/n: ${element.serial_number} ${newDeviceLabel}`);

        const deviceStr = deviceListCleanMapped.join('');
        const replaceDeviceStr = replaceDeviceListCleanMapped.join('');
        let incNumber = ticket.inc_number == "n/a" ? ticket.ticket_number : ticket.inc_number;
        let mailSubject = `${status_title} | ${ticket.sla_priority_level} | Assigned | ${incNumber ? incNumber : ticket.ticket_number} | ${ticket.shop.shop_number}-${ticket.shop.shop_name} | ${ticket.item_category} | ${ticket.title}`;
        let mailHeader = `แจ้งปิดงาน | ${incNumber ? incNumber : ticket.ticket_number}`;
        let htmlString = '<h3>' + mailHeader + '</h3><br>' +
            '<h3>Service Detail</h3><br>' +
            '<table style="width:100%;text-align:left;">' +
            '<tr><th style="vertical-align:top">Service Number</th><td style="vertical-align:top">' + ticket.ticket_number + '</td></tr>' +
            '<tr><th style="vertical-align:top">Engineer</th><td style="vertical-align:top">' + ticket.engineer.name + " " + ticket.engineer.lastname + '</td></tr>' +
            '<tr><th style="vertical-align:top">Equipment</th><td style="vertical-align:top">' + ticket.item_category + '</td></tr>' +
            '<tr><th style="vertical-align:top">Investigation</th><td style="vertical-align:top">' + ticket.investigation + '</td></tr>' +
            '<tr><th style="vertical-align:top">Solution</th><td style="vertical-align:top">' + ticket.solution + '<br>' + deviceStr + replaceDeviceStr + '</td></tr>' +
            '<tr><th style="vertical-align:top">Appointment Time</th><td style="vertical-align:top">' + ticket.appointment_date + " " + ticket.appointment_time + '</td></tr>' +
            '<tr><th style="vertical-align:top">Time Start</th><td style="vertical-align:top">' + dayjs(ticket.time_in).format('DD/MM/YYYY HH:mm') + '</td></tr>' +
            '<tr><th style="vertical-align:top">Time Finish</th><td style="vertical-align:top">' + dayjs(ticket.time_out).format('DD/MM/YYYY HH:mm') + '</td></tr>' +
            '</table>';
        let attachments: any = [];
        for (const image of ticket.ticket_image) {
            // Detect file type by extension
            let mimeType = "";
            const extension = image.name.split('.').pop()?.toLowerCase();

            if (extension === "png") {
                mimeType = "image/png";
            } else if (extension === "jpg" || extension === "jpeg") {
                mimeType = "image/jpeg";
            } else if (extension === "pdf") {
                mimeType = "application/pdf";
            } else {
                mimeType = "application/octet-stream"; // default for unknown types
            }
            attachments.push({
                filename: image.name,
                path: 'files/' + image.name,
                contentType: mimeType
            });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587, // port for secure SMTP
            tls: {
                ciphers: 'SSLv3'
            },
            secure: false,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            },
        });

        const mailOptions = {
            from: process.env.MAIL_SENDER,
            to: ticket.shop.email,
            subject: mailSubject,
            html: htmlString,
            attachments: attachments,
            cc: cc.map(obj => obj.email)
        };

        await transporter.sendMail(mailOptions);
        //line notification
        if (ticket.customer.line_close) {

            var message = `${ticket.inc_number == "n/a" ? ticket.ticket_number : ticket.inc_number}  | ${ticket.shop.shop_number}-${ticket.shop.shop_name}  | ${ticket.item_category} | ${ticket.title}\n\n`
            message += `${ticket.solution}\n\n`
            const LineoldDeviceLabel = "   นำกลับ\n";
            const LinenewDeviceLabel = "   สแปร์\n";

            const LinedeviceListCleanMapped = deviceListClean.map((element) => `\t${element.category} ${element.brand} ${element.model} s/n: ${element.serial_number} ${LineoldDeviceLabel}`);
            const LinereplaceDeviceListCleanMapped = replaceDeviceListClean.map((element) => `\t${element.category} ${element.brand} ${element.model} s/n: ${element.serial_number} ${LinenewDeviceLabel}`);

            const LinedeviceStr = LinedeviceListCleanMapped.join('');
            const LinereplaceDeviceStr = LinereplaceDeviceListCleanMapped.join('');
            message += `${LinedeviceStr}${LinereplaceDeviceStr}`
            message += `\nส่งเมลล์และรูปปิดงานเรียบร้อยครับ`

            const line_groups = ticket.customer.line_close.split(',');
            for (const group of line_groups) {
                Line_svc.sendMessage(group, message);
            }
        }

        return {
            message: "Send Mail Complete"
        };
    },


    sendReturnMail: async (id: number) => {
        const ticket = await db.tickets.findFirst({
            where: {
                id: id
            },
            include: {
                shop: true,
                engineer: true,
                customer: true,
                ticket_image: {
                    where: {
                        deleted_at: null
                    }
                },
                store_item: {
                    where: {
                        deleted_at: null
                    }
                },
                spare_item: {
                    where: {
                        deleted_at: null
                    }
                },
                return_ticket: {
                    where: {
                        deleted_at: null
                    }
                },
                return_ticket_images: {
                    where: {
                        deleted_at: null
                    }
                },
                return_item: {
                    where: {
                        deleted_at: null
                    }
                }
            }
        });

        if (!ticket) return { message: "No Ticket Data" }
        const cc = await db.mail_recipient.findMany({
            where: {
                customer_id: ticket.customer_id
            }
        })
        // Set email content
        let status_title = ""
        status_title = "Return Case";
        // if (ticket.ticket_status == "close") {
        //     status_title = "Resolved Case";
        // } else if (ticket.ticket_status == "spare") {
        //     status_title = "Install Spare";
        // }

        const deviceListClean = ticket.return_item.filter((element) => element.item_type == "spare" && element.status == "return");
        const replaceDeviceListClean = ticket.return_item.filter((element) => element.item_type == "store" && element.status == "return");

        const oldDeviceLabel = "   เก่า<br>";
        const newDeviceLabel = "   ใหม่<br>";

        const deviceListCleanMapped = deviceListClean.map((element) => `• ${element.category} ${element.brand} ${element.model} s/n: ${element.serial_number} ${oldDeviceLabel}`);
        const replaceDeviceListCleanMapped = replaceDeviceListClean.map((element) => `• ${element.category} ${element.brand} ${element.model} s/n: ${element.serial_number} ${newDeviceLabel}`);

        const deviceStr = deviceListCleanMapped.join('');
        const replaceDeviceStr = replaceDeviceListCleanMapped.join('');
        let incNumber = ticket.inc_number == "n/a" ? ticket.ticket_number : ticket.inc_number;
        let mailSubject = `${status_title} | ${ticket.sla_priority_level} | Assigned | ${incNumber ? incNumber : ticket.ticket_number} | ${ticket.shop.shop_number}-${ticket.shop.shop_name} | ${ticket.item_category} | ${ticket.title}`;
        let mailHeader = `แจ้งปิดงาน | ${incNumber ? incNumber : ticket.ticket_number}`;
        let htmlString = '<h3>' + mailHeader + '</h3><br>' +
            '<h3>Service Detail</h3><br>' +
            '<table style="width:100%;text-align:left;">' +
            '<tr><th style="vertical-align:top">Service Number</th><td style="vertical-align:top">' + ticket.ticket_number + '</td></tr>' +
            '<tr><th style="vertical-align:top">Engineer</th><td style="vertical-align:top">' + ticket.engineer.name + " " + ticket.engineer.lastname + '</td></tr>' +
            '<tr><th style="vertical-align:top">Equipment</th><td style="vertical-align:top">' + ticket.return_ticket?.item_category + '</td></tr>' +
            '<tr><th style="vertical-align:top">Investigation</th><td style="vertical-align:top">' + ticket.return_ticket?.investigation + '</td></tr>' +
            '<tr><th style="vertical-align:top">Solution</th><td style="vertical-align:top">' + ticket.return_ticket?.solution + '<br>' + deviceStr + replaceDeviceStr + '</td></tr>' +
            '<tr><th style="vertical-align:top">Appointment Time</th><td style="vertical-align:top">' + ticket.appointment_date + " " + ticket.appointment_time + '</td></tr>' +
            '<tr><th style="vertical-align:top">Time Start</th><td style="vertical-align:top">' + dayjs(ticket.return_ticket?.time_in).format('DD/MM/YYYY HH:mm') + '</td></tr>' +
            '<tr><th style="vertical-align:top">Time Finish</th><td style="vertical-align:top">' + dayjs(ticket.return_ticket?.time_out).format('DD/MM/YYYY HH:mm') + '</td></tr>' +
            '</table>';
        let attachments: any = [];
        for (const image of ticket.return_ticket_images) {
            // Detect file type by extension
            let mimeType = "";
            const extension = image.name.split('.').pop()?.toLowerCase();

            if (extension === "png") {
                mimeType = "image/png";
            } else if (extension === "jpg" || extension === "jpeg") {
                mimeType = "image/jpeg";
            } else if (extension === "pdf") {
                mimeType = "application/pdf";
            } else {
                mimeType = "application/octet-stream"; // default for unknown types
            }
            attachments.push({
                filename: image.name,
                path: 'files/' + image.name,
                contentType: mimeType
            });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587, // port for secure SMTP
            tls: {
                ciphers: 'SSLv3'
            },
            secure: false,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            },
        });

        const mailOptions = {
            from: process.env.MAIL_SENDER,
            to: ticket.shop.email,
            subject: mailSubject,
            html: htmlString,
            attachments: attachments,
            cc: cc.map(obj => obj.email)
        };

        await transporter.sendMail(mailOptions);

        if (ticket.customer.line_close) {
            var message = `${ticket.inc_number == "n/a" ? ticket.ticket_number : ticket.inc_number}  | ${ticket.shop.shop_number}-${ticket.shop.shop_name}  | ${ticket.item_category} | ${ticket.title}\n\n`
            message += `${ticket.solution}\n\n`
            const LineoldDeviceLabel = "   นำกลับ\n";
            const LinenewDeviceLabel = "   สแปร์\n";

            const LinedeviceListCleanMapped = deviceListClean.map((element) => `\t${element.category} ${element.brand} ${element.model} s/n: ${element.serial_number} ${LineoldDeviceLabel}`);
            const LinereplaceDeviceListCleanMapped = replaceDeviceListClean.map((element) => `\t${element.category} ${element.brand} ${element.model} s/n: ${element.serial_number} ${LinenewDeviceLabel}`);

            const LinedeviceStr = LinedeviceListCleanMapped.join('');
            const LinereplaceDeviceStr = LinereplaceDeviceListCleanMapped.join('');
            message += `${LinedeviceStr}${LinereplaceDeviceStr}`
            message += `\nส่งเมลล์และรูปปิดงานเรียบร้อยครับ`

            const line_groups = ticket.customer.line_close.split(',');
            for (const group of line_groups) {
                Line_svc.sendMessage(group, message);
            }
        }

        return {
            message: "Send Mail Complete"
        };
    },

    sendAppointmentMail: async (id: number, payload: mailRemark) => {
        const ticket = await db.tickets.findFirst({
            where: {
                id: id
            },
            include: {
                shop: {
                    include: {
                        province: true
                    }
                },
                engineer: true,
                customer: true,
                ticket_image: {
                    where: {
                        deleted_at: null
                    }
                },
                prioritie: true
            }
        });

        if (!ticket) return { message: "No Ticket Data" }
        // Set email content
        let mailSubject = `Appointment | ${ticket.sla_priority_level} | Assigned | ${ticket.inc_number == "n/a" ? ticket.ticket_number : ticket.inc_number} | ${ticket.shop.shop_number}-${ticket.shop.shop_name} | ${ticket.item_category} | ${ticket.title}`;
        let htmlString = `
            <p>Open Case ${ticket.inc_number == "n/a" ? ticket.ticket_number : ticket.inc_number}</p>
            <p>Title : ${ticket.title}</p>
            <p>Cases Number : ${ticket.ticket_number}</p>
            <p>Store ID : ${ticket.shop.shop_number}</p>
            <p>Store Name : ${ticket.shop.shop_name}</p>
            <p>Province : ${ticket.shop.province.name}</p>
            <p>Contact Name : ${ticket.contact_name}</p>
            <p>Contact Phone : ${ticket.contact_tel}</p>
            <p>Priority : ${ticket.sla_priority_level} ${SecToTimeString(parseInt(ticket.prioritie?.time_sec ? ticket.prioritie.time_sec : "0"))}</p>
            <p>Engineer : ${ticket.engineer.name} ${ticket.engineer.lastname}</p>
            <p>Appointment : ${ticket.appointment_date} ${ticket.appointment_time}</p>
            <br>
            <p>ช่างนัดหมายสาขาวันที่ ${ticket.appointment_date} ${ticket.appointment_time} ${payload.remark || "เนื่องจากสาขาสะดวกให้เข้าเวลาดังกล่าว"}</p>
        `;

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587, // port for secure SMTP
            tls: {
                ciphers: 'SSLv3'
            },
            secure: false,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            },
        });

        const mailOptions = {
            from: process.env.MAIL_SENDER,
            to: ticket.shop.email,
            subject: mailSubject,
            html: htmlString,
        };

        await transporter.sendMail(mailOptions);

        //send line notification
        if (ticket.customer.line_appointment) {
            var message = `Open Case ${(ticket?.inc_number === 'n/a' ? ticket?.ticket_number : ticket?.inc_number)}\n`
            message += `Title : ${ticket.title}\n`
            message += `Cases Number : ${ticket.ticket_number}\n`
            message += `Store ID : ${ticket.shop.shop_number}\n`
            message += `Store Name :  ${ticket.shop.shop_name}\n`
            message += `Province : ${ticket.shop.province.name}\n`
            message += `Contact Name : ${ticket.contact_name}\n`
            message += `Contact Phone : ${ticket.contact_tel}\n`
            message += `Priority : ${ticket.sla_priority_level} (${ticket.prioritie?.time_sec ? SecToTimeString(parseInt(ticket.prioritie.time_sec)) : ""}.)\n`
            message += `Engineer : ${ticket.engineer.name} ${ticket.engineer.lastname}\n`
            message += `Appointment : ${dayjs(ticket.appointment_date).format('DD/MM/YYYY')} ${ticket.appointment_time}\n`
            message += `ช่างนัดหมายสาขาวันที่ : ${dayjs(ticket.appointment_date).format('DD/MM/YYYY')} ${ticket.appointment_time}\n`

            const line_groups = ticket.customer.line_appointment;
            for (const group of line_groups.split(',')) {
                Line_svc.sendMessage(group, message);
            }
        }
        return {
            message: "Send Mail Complete"
        };
    },

    sendOpenTicketMail: async (id: number,user_id: number) => {
        const ticket = await db.tickets.findFirst({
            where: {
                id: id
            },
            include: {
                shop: {
                    include: {
                        province: true
                    }
                },
                engineer: true,
                customer: {
                    include: {
                        mail_signature: true
                    }
                },
                prioritie: true
            }
        });
        const user = await db.users.findFirst({where: {id: user_id}})
        var mailSubject = `[${ticket?.prioritie?.name} : Open ] | ${ticket?.ticket_number} | ${ticket?.shop.shop_number}-${ticket?.shop.shop_name} | ${ticket?.item_category} | ${ticket?.title}`
        if (!ticket) return { message: "No Ticket Data" }
        if (!ticket.shop.email) return { message: "No Destination Email" }
        let signature = ticket.customer.mail_signature ? `
            <div dir="ltr" class="gmail_signature" >
                <div dir="ltr" style="margin: 0; padding: 0;">
                   <div style="margin: 0; padding: 0; color: gray; line-height: 0.2;">
                    <p>${user?.fullname}</p>
                    ${ticket.customer?.mail_signature?.signature_body}
                    </div>
                    <img 
                    src="${Bun.env.FILE_URL+ticket.customer?.mail_signature?.image}" 
                    width="96" 
                    height="43"
                    style="filter: grayscale(100%);" 
                    alt="Company Logo"
                    />
                </div>
            </div>
        ` : ""
        let htmlString = `
        <div dir="ltr">
            <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">
                <b><span style="font-size:12pt;font-family:Tahoma,sans-serif">Ticket Number (<span lang="TH">เลขที่ใบแจ้งงาน):&nbsp;</span></span></b>
                <span style="font-family:Arial,Helvetica,sans-serif;font-size:small">${ticket.ticket_number}</span>
            </p>
    
            <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">
                &nbsp;
            </p>
    
            <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">
                <b><span style="font-size:12pt;font-family:Tahoma,sans-serif">Contact (<span lang="TH">ผู้แจ้ง)</span></span></b>
                <span lang="TH" style="font-size:12pt;font-family:Tahoma,sans-serif">: ${ticket.contact_name}</span>
            </p>
    
            <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">
                &nbsp;
            </p>
    
            <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">
                <b><span style="font-size:12pt;font-family:Tahoma,sans-serif">Phone (<span lang="TH">เบอร์โทร)</span></span></b>
                <span lang="TH" style="font-size:12pt;font-family:Tahoma,sans-serif">:&nbsp;</span>
                <span style="font-family:Arial,Helvetica,sans-serif;font-size:small">${ticket?.contact_tel}</span>
            </p>
    
            <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">
                &nbsp;
            </p>
    
            <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">
                <b><span style="font-size:12pt;font-family:Tahoma,sans-serif">Store (<span lang="TH">สาขา):&nbsp;</span></span></b>
                <span style="font-size:12pt;font-family:Tahoma,sans-serif">&nbsp;</span>
                <span style="font-family:Arial,Helvetica,sans-serif;font-size:small">${ticket?.shop.shop_number}-${ticket.shop.shop_name}</span>
            </p>
    
            <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">
                &nbsp;
            </p>
    
            <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">
                <b><span style="font-size:12pt;font-family:Tahoma,sans-serif">Description (<span lang="TH">รายละเอียด):&nbsp;</span></b>
                <span lang="TH" style="font-size:12pt;font-family:Tahoma,sans-serif">: ${ticket.description.replace(/\n/g, '<br>')}</span>
            </p>
    
            <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">
                &nbsp;
            </p>
    
            <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">
                <b><span style="font-size:12pt;font-family:Tahoma,sans-serif">Incident open date/time (<span lang="TH">วันและเวลาที่เปิดงาน):&nbsp;</span></span></b>
                <span style="font-size:12pt;font-family:Tahoma,sans-serif">${dayjs(ticket.open_date).format("DD/MM/YYYY")} ${ticket.open_time}</span>
            </p>
    
            <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">
                &nbsp;
            </p>
    
            <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">
                <b><span style="font-size:12pt;font-family:Tahoma,sans-serif">Estimate Resolving Time (เวลาแก้ไขโดยประมาณ):&nbsp;</span></b>
                <span style="font-size:12pt;font-family:Tahoma,sans-serif"> ${ticket.prioritie?.name} ${SecToTimeString(parseInt(ticket.prioritie?.time_sec!))}</span>
            </p>
    
            <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">
                &nbsp;
            </p>
    
            <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">
                <b><span style="font-size:12pt;font-family:Tahoma,sans-serif">DueBy Date (<span lang="TH">วันและเวลาที่ครบกำหนด):&nbsp;</span></span></b>
                <span style="font-family:Tahoma,sans-serif;font-size:16px">${dayjs(ticket.due_by).format("DD/MM/YYYY hh:mm")}</span>
            </p>
    
            <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">
                &nbsp;
            </p>
    
          ${signature}
        </div>`;

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587, // port for secure SMTP
            tls: {
                ciphers: 'SSLv3'
            },
            secure: false,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            },
        });

        const mailOptions = {
            from: process.env.MAIL_SENDER,
            to: ticket.shop.email,
            subject: mailSubject,
            html: htmlString,
            // attachments: attachments,
            // cc: cc.map(obj => obj.email)
        };

        await transporter.sendMail(mailOptions);

        return {
            message: "Send Mail Complete"
        };

    },

    deleteReturnItem: async (id: number) => {
        return await db.return_items.delete({
            where: {
                id: id
            }
        });
    }
}
