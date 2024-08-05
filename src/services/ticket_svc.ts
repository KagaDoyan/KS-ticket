import { action_status, ticket_status, Prisma, item_status, item_type } from "@prisma/client";
import db from "../adapter.ts/database";

interface itemList {
    id?: number,
	serial_number: string,
	category_id: number,
	brand_id: number,
	model_id: number,
	warranty_expiry_date?: any,
	inc_number: string,
	status: item_status,
    type: item_type
}

interface ticketPayload {
    id?: number,
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
    warranty_exp?: any,
    resolve_status?: boolean,
    resolve_remark?: string,
    action?: action_status,
    time_in?: any,
    time_out?: any,
    store_item?: itemList[],
    spare_item?: itemList[]
}

async function generateRandomNumber(length: number): Promise<string> {
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
    if(checkTicketNumber){
        return generateRandomNumber(length);
    }
    return ticketNumber;
}

export const ticketSvc = {
    getAllTicket: async (limit: number, page: number, status: ticket_status, search: string) => {
        let whereCondition: Prisma.ticketsWhereInput = {
			deleted_at: null,
            ...(status && { ticket_status: status })
		}

		if(search){
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
            include:{
                created_user: true,
                engineer:true
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
        let ticketNumber: string = await generateRandomNumber(10);
        const ticket = await db.tickets.create({
            data: {
                inc_number: payload.inc_number,
                ticket_number: ticketNumber,
                customer_id: payload.customer_id,
                shop_id: payload.shop_id,
                open_date: payload.open_date,
                open_time: payload.open_time,
                close_date: payload.close_date,
                close_time: payload.close_time,
                title: payload.title,
                description: payload.description,
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
                warranty_exp: payload.warranty_exp,
                resolve_status: payload.resolve_status,
                resolve_remark: payload.resolve_remark,
                action: payload.action,
                time_in: payload.time_in,
                time_out: payload.time_out
            }
        });
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
                description: payload.description,
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

    updateCloseTicket: async (id: number, payload: ticketPayload) => {
        const ticket = await db.tickets.update({
            where: {
                id: id
            },
            data: {
                ticket_status: payload.ticket_status,
                close_date: payload.close_date,
                close_time: payload.close_time,
                solution: payload.solution,
                investigation: payload.investigation,
                close_description: payload.close_description,
                item_brand: payload.item_brand,
                item_category: payload.item_category,
                item_model: payload.item_model,
                item_sn: payload.item_sn,
                warranty_exp: payload.warranty_exp,
                resolve_status: payload.resolve_status,
                resolve_remark: payload.resolve_remark,
                action: payload.action,
                time_in: payload.time_in,
                time_out: payload.time_out
            }
        });
        if(payload.store_item != null && payload.store_item.length != 0) {
            for(const item of payload.store_item) {
                let item_sn = item.serial_number;
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
                if(checkItem){
                    await db.store_items.create({
                        data: {
                            ticket_id: id,
                            item_brand: checkItem.brand.name,
                            item_category: checkItem.category.name,
                            item_model: checkItem.model.name,
                            item_sn: item_sn,
                            warranty_exp: checkItem.warranty_expiry_date,
                            type: checkItem.status
                        }
                    });

                    await db.items.update({
                        where: {
                            id: checkItem.id
                        },
                        data: {
                            status: checkItem.status,
                            type: item.type
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
                        warranty_expiry_date: item.warranty_expiry_date,
                        inc_number: item.inc_number,
                        status: item.status,
                        type: item.type,
                        created_by: payload.created_by,
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
                        item_brand: newItem.brand.name,
                        item_category: newItem.category.name,
                        item_model: newItem.model.name,
                        item_sn: item_sn,
                        warranty_exp: newItem.warranty_expiry_date,
                        type: newItem.status
                    }
                });
            }
        }

        if(payload.spare_item != null && payload.spare_item.length != 0) {
            for(const item of payload.spare_item) {
                let item_sn = item.serial_number;
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
                if(checkItem){
                    await db.spare_items.create({
                        data: {
                            ticket_id: id,
                            item_brand: checkItem.brand.name,
                            item_category: checkItem.category.name,
                            item_model: checkItem.model.name,
                            item_sn: item_sn,
                            warranty_exp: checkItem.warranty_expiry_date,
                            type: checkItem.status
                        }
                    });

                    await db.items.update({
                        where: {
                            id: checkItem.id
                        },
                        data: {
                            status: checkItem.status,
                            type: item.type
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
                        warranty_expiry_date: item.warranty_expiry_date,
                        inc_number: item.inc_number,
                        status: item.status,
                        type: item.type,
                        created_by: payload.created_by,
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
                        item_brand: newItem.brand.name,
                        item_category: newItem.category.name,
                        item_model: newItem.model.name,
                        item_sn: item_sn,
                        warranty_exp: newItem.warranty_expiry_date,
                        type: newItem.status
                    }
                });
            }
        }
        return ticket;
    },

    getTicketByID: async (id: number) => {
        const ticket = await db.tickets.findUnique({
            where: {
                id: id
            }
        });
        return ticket;
    }
}