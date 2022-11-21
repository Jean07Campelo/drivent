import { prisma } from "@/config";
import { TicketStatus } from "@prisma/client";

type PaymentType = 
{ ticketId: number, value: number, cardIssuer: string, cardLastDigits: string };

async function create({ ticketId, value, cardIssuer, cardLastDigits }: PaymentType) {
  return prisma.payment.create({
    data: {
      ticketId,
      value,
      cardIssuer,
      cardLastDigits
    }
  });
}

async function findFirst(paymentId: number) {
  return prisma.payment.findFirst({
    where: {
      id: paymentId
    }
  });
}

async function update(ticketId: number) {
  return prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: TicketStatus.PAID
    }
  });
}

const paymentRepository = {
  create,
  findFirst,
  update,
};

export default paymentRepository;
