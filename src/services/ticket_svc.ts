import { action_status, ticket_status, Prisma } from "@prisma/client";
import db from "../adapter.ts/database";

interface ticketPayload {
    id?: number,
    inc_number: string,
    ticket_number?: string,
    customer_id: number,
    store_id: number,
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
    item_brand?: string,
    item_category?: string,
    item_model?: string,
    item_sn?: string,
    warranty_exp?: any,
    resolve_status?: string,
    resolve_remark?: string,
    action?: action_status,
    time_in?: any,
    time_out?: any
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
			take: limit
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
                store_id: payload.store_id,
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
    }
}