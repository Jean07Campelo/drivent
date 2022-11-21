import ticketRepository from "@/repositories/ticket-repository";
import userRepository from "@/repositories/user-repository";
import { TicketType, Enrollment, Ticket } from "@prisma/client";
import { notFoundError } from "@/errors";

async function getManyTickets(): Promise<TicketType[]> {
  return ticketRepository.findMany();
}

async function getEnrollmentByUserId(userId: number): Promise<Enrollment> {
  const enrollmentUser = await userRepository.findByUserId(userId);
  if (!enrollmentUser) {
    throw notFoundError();
  }
  return enrollmentUser;
}

type upsertTicketType = Pick<Ticket, "ticketTypeId" | "enrollmentId">;

async function postTicket({ ticketTypeId, enrollmentId }: upsertTicketType): Promise<Ticket> {
  return ticketRepository.create({ ticketTypeId, enrollmentId });
}

type ticketByEnrollmentIdType = {
  id: number;
  ticketTypeId: number;
  enrollmentId: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  TicketType: TicketType;
};

async function getTicketByEnrollmentId(enrollmentId: number): Promise<ticketByEnrollmentIdType> {
  const ticket = await ticketRepository.findFirst(enrollmentId);
  if (!ticket) throw notFoundError();
  return ticket;
}

const ticketService = {
  getManyTickets,
  getEnrollmentByUserId,
  postTicket,
  getTicketByEnrollmentId,
};

export default ticketService;
