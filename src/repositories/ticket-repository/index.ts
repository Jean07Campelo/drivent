import { prisma } from "@/config";
import { Ticket, TicketStatus } from "@prisma/client";

async function findMany() {
  return prisma.ticketType.findMany();
}

type upsertTicketType = Pick<Ticket, "ticketTypeId" | "enrollmentId">;

async function create({ ticketTypeId, enrollmentId }: upsertTicketType) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status: TicketStatus.RESERVED
    },
  });
}

async function findFirst(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId,
    },
    include: {
      TicketType: true,
    },
  });
}

const ticketRepository = {
  findMany,
  create,
  findFirst,
};

export default ticketRepository;
