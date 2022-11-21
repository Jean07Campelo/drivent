import { Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";
import paymentService from "@/services/payments-service";
import ticketService from "@/services/tickets-service";
import enrollmentsService from "@/services/enrollments-service";

type PaymentType = {
  ticketId: number;
  cardData: {
    issuer: string;
    number: number;
    name: string;
    expirationDate: Date;
    cvv: number;
  };
};

async function validateTicketId(ticketId: number) {
  try {
    return await ticketService.getTicketById(ticketId);
  } catch (error) {
    return error;
  }
}

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const card = req.body as PaymentType;
  const { ticketId } = card;
  
  try {
    const ticketIsValid = await ticketService.getTicketById(ticketId);
    if (!ticketIsValid) return res.sendStatus(httpStatus.NOT_FOUND);

    const enrollmentUser = await enrollmentsService.getOneWithAddressByUserId(userId);
    const ticketByUser = ticketIsValid.enrollmentId;
    if (enrollmentUser.id !== ticketByUser) return res.sendStatus(httpStatus.UNAUTHORIZED);

    //ticketId - ok
    ticketId;

    //value - tycketType
    const ticket = await ticketService.getTicketById(ticketId);
    const ticketTypeId = ticket.ticketTypeId;
    const ticketType = await ticketService.getTicketTypeById(ticketTypeId);
    const value = ticketType.price;

    //cardIssuer - body
    const cardIssuer = card.cardData.issuer;

    //cardLastDigits - body
    const { number } = card.cardData;
    const cardLastDigits = number.toString().slice(-4);
  
    const registerPayment = await paymentService.createPayment({ ticketId, value, cardIssuer, cardLastDigits });

    await ticketService.updatePaymentByTicketId(ticketId);

    return res.status(httpStatus.OK).send(registerPayment);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
  }

  return res.status(httpStatus.OK).send("segue firme");
}

export async function getTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const ticketId = Number(req.query.ticketId);
  if (!ticketId) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const ticketExists = await ticketService.getTicketById(ticketId);
    if (!ticketExists) return res.sendStatus(httpStatus.BAD_REQUEST);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }

  try {
    const ticketIsValid = await validateTicketId(ticketId);
    if (!ticketIsValid) return res.sendStatus(httpStatus.NOT_FOUND);

    const enrollmentUser = await enrollmentsService.getOneWithAddressByUserId(userId);
    const ticketByUser = ticketIsValid.enrollmentId;

    if (enrollmentUser.id !== ticketByUser) return res.sendStatus(httpStatus.UNAUTHORIZED);

    const dataPayment = await ticketService.getPaymentByTicketId(ticketId);

    return res.status(httpStatus.OK).send(dataPayment);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
  }
}
