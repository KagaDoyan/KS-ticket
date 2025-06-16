import { Prisma } from "@prisma/client"
import db from "../adapter.ts/database"
import dayjs from "dayjs"

interface nodePayload {
    id?: number,
    name: string;
    created_by: number;
    provinceData: { province_id: number; node_time: number }[];
}

export const NodeSvc = {
    getallNodes: async (limit: number, page: number, search: string) => {
        let whereCondition: Prisma.nodesWhereInput = {
            deleted_at: null
        }
        if (search) {
            whereCondition.AND = [
                {
                    name: { contains: search }
                }
            ]
        }
        const total_nodes = await db.nodes.count({
            where: whereCondition
        })
        const totalPages = Math.ceil(total_nodes / limit);
        const offset = (page - 1) * limit;
        const nodes = await db.nodes.findMany({
            where: whereCondition,
            skip: offset,
            take: limit,
            orderBy: {
                id: "desc"
            },
            include: {
                node_on_province: {
                    include: {
                        provinces: true
                    }
                }
            }
        })
        return {
            page: page,
            limit: limit,
            total_page: totalPages,
            total_rows: total_nodes,
            data: nodes
        }
    },
    createNodeWithProvinces: async (data: nodePayload) => {
        const { name, created_by, provinceData } = data;

        try {
            const node = await db.nodes.create({
                data: {
                    name,
                    created_by,
                    node_on_province: {
                        create: provinceData.map((item) => ({
                            province_id: item.province_id,
                            node_time: item.node_time,
                        })),
                    },
                },
            });

            console.log('Node created successfully:', node);
            return node;
        } catch (error) {
            console.error('Error creating node:', error);
            throw error;
        }
    },

    updateNode: async (id: number, payload: nodePayload) => {
        try {
            // Step 1: Update the `nodes` table
            const node = await db.nodes.update({
                where: { id },
                data: {
                    name: payload.name,
                    created_by: payload.created_by,
                },
            });

            // Step 2: Handle `node_on_province` updates
            const currentProvinces = await db.node_on_province.findMany({
                where: { node_id: id },
                select: { province_id: true },
            });

            const currentProvinceIds = currentProvinces.map((p) => p.province_id);

            // Identify provinces to create, update, and delete
            const provincesToCreate = payload.provinceData.filter((p) => !currentProvinceIds.includes(p.province_id));
            const provincesToUpdate = payload.provinceData.filter((p) => currentProvinceIds.includes(p.province_id));
            const provincesToDelete = currentProvinces.filter((p) => !payload.provinceData.some((newP) => newP.province_id === p.province_id));

            // Step 2a: Create new `node_on_province` entries
            for (const province of provincesToCreate) {
                await db.node_on_province.create({
                    data: {
                        node_id: id,
                        province_id: province.province_id,
                        node_time: province.node_time,
                    },
                });
            }

            // Step 2b: Update existing `node_on_province` entries
            for (const province of provincesToUpdate) {
                await db.node_on_province.update({
                    where: {
                        province_id_node_id: {
                            node_id: id,
                            province_id: province.province_id,
                        },
                    },
                    data: {
                        node_time: province.node_time,
                    },
                });
            }

            // Step 2c: Delete `node_on_province` entries that are not in the provided data
            for (const province of provincesToDelete) {
                await db.node_on_province.delete({
                    where: {
                        province_id_node_id: {
                            node_id: id,
                            province_id: province.province_id,
                        },
                    },
                });
            }

            console.log('Node and node_on_province updated successfully');
            return node;
        } catch (error) {
            console.error('Error updating node and node_on_province:', error);
            throw error;
        }
    },

    softDeleteNode: async (id: number) => {
        const node = await db.nodes.update({
            where: {
                id: id
            },
            data: {
                deleted_at: new Date()
            }
        })
        return node
    },

    getNodebyID: async (id: number) => {
        const node = await db.nodes.findUnique({
            where: {
                id: id
            },
            include: {
                node_on_province: {
                    include: {
                        provinces: true
                    }
                }
            }
        })
        return node
    },

    getNodeOption: async () => {
        const nodes = await db.nodes.findMany({
            where: {
                deleted_at: null
            },
            select: {
                id: true,
                name: true
            }
        })
        return nodes
    },

    getNodewithActiveEngineer: async (date: string,customer_id: string) => {
        try {
            const today = date ? new Date(date) : new Date();
            const todayDate = today.toISOString().split("T")[0];
            let whereCondition: Prisma.ticketsWhereInput = {
                open_date: todayDate,
            }
            whereCondition.AND = []

            if (customer_id) {
                whereCondition.AND.push({
                    customer_id: Number(customer_id)
                })
            }

            const nodes = await db.nodes.findMany({
                select: {
                    id: true,
                    name: true,
                    engineers: {
                        where: {
                            deleted_at: null
                        },
                        select: {
                            node: {
                                select: {
                                    name: true
                                }
                            },
                            id: true,
                            name: true, // Include engineer name
                            lastname: true,
                            tickets: {
                                where: whereCondition,
                                select: {
                                    inc_number: true,
                                    ticket_status: true,
                                    open_date: true,
                                    open_time: true,
                                    close_date: true,
                                    close_time: true,
                                    ticket_number: true, // Include ticket number
                                    shop: {
                                        select: {
                                            shop_name: true,
                                            shop_number: true,
                                        }
                                    }
                                },
                            },
                        },
                    },
                },
            });

            // console.log(JSON.stringify(nodes, null, 2))

            const nodeSummary = nodes.map((node) => {
                const totalEngineers = node.engineers.length;
                const uniqueWorkingEngineers = new Set<number>();

                // Initialize hourly distribution
                const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => ({
                    time: `${hour.toString().padStart(2, "0")}:00`,
                    working: 0,
                    available: totalEngineers,
                    workingEngineers: new Set<number>(),
                    ticketDetails: [] as any[], // Array to store ticket_number and engineer_name
                }));

                // Process tickets
                node.engineers.forEach((engineer) => {
                    engineer.tickets.forEach((ticket) => {
                        const openDateTime = new Date(`${ticket.open_date}T${ticket.open_time}`);
                        const openHour = openDateTime.getHours();

                        // Validate openHour is within bounds
                        if (openHour >= 0 && openHour < 24 && hourlyDistribution[openHour]) {
                            // Update hourly distribution
                            if (!hourlyDistribution[openHour].workingEngineers.has(engineer.id)) {
                                hourlyDistribution[openHour].workingEngineers.add(engineer.id);
                                hourlyDistribution[openHour].working++;
                                hourlyDistribution[openHour].available--;
                            }

                            
                            // Add ticket details
                            hourlyDistribution[openHour].ticketDetails.push({
                                ticket_number: ticket.ticket_number,
                                inc_number: ticket.inc_number,
                                engineer_name: engineer.name + " " + engineer.lastname,
                                shop_name: ticket.shop.shop_number + "-" + ticket.shop.shop_name,
                                node_name: node.name
                            });
                        } else {
                            console.warn(`Invalid hour value (${openHour}) for ticket ${ticket.ticket_number}`);
                        }

                        // Track unique engineers for the day
                        uniqueWorkingEngineers.add(engineer.id);
                    });
                });

                // Calculate totals
                const totalUniqueWorkingEngineers = uniqueWorkingEngineers.size;
                const totalAvailable = totalEngineers - totalUniqueWorkingEngineers;

                return {
                    date: dayjs(todayDate).format("DD/MM/YYYY"),
                    nodeId: node.id,
                    nodeName: node.name,
                    totalEngineers,
                    totalWorking: totalUniqueWorkingEngineers,
                    totalAvailable,
                    hourlyDistribution: hourlyDistribution.map(({ time, working, available, ticketDetails }) => ({
                        time,
                        working,
                        available,
                        ticketDetails, // Include ticketDetails in the response
                    })),
                };
            });

            return nodeSummary;
        } catch (error) {
            console.error("Error fetching node data:", error);
            throw new Error("Unable to fetch node data. Please try again later.");
        }
    },


    getEngineersTaskCountForNode: async (nodeId: number, date: string) => {
        let today: Date;
        if (!date) {
            today = new Date(); // Defaults to today's date if no date is provided
        } else {
            today = new Date(date); // Use the provided date
        }

        const todayDate = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD

        // Fetch the specific node with its engineers and their tickets
        const node = await db.nodes.findUnique({
            where: {
                id: nodeId, // Filter by node ID
            },
            select: {
                id: true,
                name: true,
                engineers: {
                    where: {
                        deleted_at: null
                    },
                    select: {
                        id: true,
                        name: true,
                        lastname: true,
                        tickets: {
                            where: {
                                open_date: todayDate, // Filter tickets opened today
                            },
                            select: {
                                id: true, // Select ticket ID
                                ticket_number: true,
                                ticket_status: true,
                                open_date: true,
                                open_time: true,
                                close_date: true,
                                close_time: true,
                                time_in: true, // Include the 'time_in' field
                                time_out: true, // Include the 'time_out' field
                            },
                        },
                    },
                },
            },
        });

        if (!node) {
            throw new Error(`Node with ID ${nodeId} not found`);
        }

        // Map engineers to count their tasks for the day and include ticket details
        const engineersWithTaskCount = node.engineers.map((engineer) => {
            // Create a list of ticket details for the engineer
            const tickets = engineer.tickets.map((ticket) => ({
                ticket_number: ticket.ticket_number,
                ticket_status: ticket.ticket_status,
                open_date: dayjs(ticket.open_date).format("DD/MM/YYYY"),
                time_in: dayjs(ticket.time_in).format("DD/MM/YYYY HH:mm"), // 'open_time' is used as 'time_in' make it DD/MM/YYYY HH:mm
                time_out: dayjs(ticket.time_out).format("DD/MM/YYYY HH:mm"), // 'close_time' is used as 'time_out' make it DD/MM/YYYY HH:mm
            }));

            const taskCount = engineer.tickets.length; // Count the number of tickets assigned to the engineer

            return {
                engineerId: engineer.id,
                engineerName: engineer.name + " " + engineer.lastname,
                taskCount, // Number of tasks (tickets) for the engineer on the selected day
                tickets, // List of tickets with their details
            };
        });

        // Return the node information along with engineers and their task details
        return {
            nodeId: node.id,
            nodeName: node.name,
            engineers: engineersWithTaskCount, // List of engineers with their task counts and tickets
        };
    }
}