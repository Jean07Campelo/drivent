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

async function update(ticketId: number) {
  return prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: TicketStatus.PAID,
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

async function findFirstTicket(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
    }
  });
}

async function findFirstTicketType(ticketTypeId: number) {
  return prisma.ticketType.findFirst({
    where: {
      id: ticketTypeId
    }
  });
}

async function findFisrtTicketAndEnrollment(ticketId: number, enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
      enrollmentId
    }
  });
}

async function findFirstEnrollmentById(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId
    }
  });
}

async function findFirstPayment(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId
    }
  });
}

const ticketRepository = {
  findMany,
  create,
  findFirst,
  findFirstTicket,
  findFirstTicketType,
  findFisrtTicketAndEnrollment,
  findFirstEnrollmentById,
  findFirstPayment,
  update
};

export default ticketRepository;
