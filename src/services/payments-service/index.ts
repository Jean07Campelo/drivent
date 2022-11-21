import { Payment, Ticket } from "@prisma/client";
import paymentRepository from "@/repositories/payment-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { notFoundError } from "@/errors";

type PaymentType = 
{ ticketId: number, value: number, cardIssuer: string, cardLastDigits: string };

async function createPayment({ ticketId, value, cardIssuer, cardLastDigits }: PaymentType): Promise<Payment> {
  return paymentRepository.create({ ticketId, value, cardIssuer, cardLastDigits });
}

async function getPayment(paymentId: number): Promise<Payment> {
  const payment = await paymentRepository.findFirst(paymentId);
  if (!payment) throw notFoundError();
  return payment;
}

async function updatePayment(ticketId: number): Promise<Ticket> {
  const update = await paymentRepository.update(ticketId);
  if (!update) throw notFoundError();
  return update;
}

const paymentService = {
  createPayment,
  getPayment,
  updatePayment,
};

export default paymentService;
