import ticketRepository from "@/repositories/ticket-repository";
import { TicketType } from "@prisma/client";

async function getManyTickets(): Promise<TicketType[]> {
  return ticketRepository.findMany();
}

const ticketService = {
  getManyTickets,
};

export default ticketService;
