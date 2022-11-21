import { Request, Response } from "express";
import httpStatus from "http-status";
import ticketService from "@/services/tickets-service";
import { AuthenticatedRequest } from "@/middlewares";

export async function getTicketsTypes(req: Request, res: Response) {
  try {
    const ticketsTypes = await ticketService.getManyTickets();
    return res.status(httpStatus.OK).send(ticketsTypes);
  } catch (error) {
    if (error.name === "NotFoundError") return res.send(httpStatus.NOT_FOUND);
  }
}

export async function postTicket(req: AuthenticatedRequest, res: Response) {
  const ticketTypeId = req.body.ticketTypeId as number;
  const { userId } = req;

  try {
    const userExists = await ticketService.getEnrollmentByUserId(userId);
    if (!userExists) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    const enrollmentId: number = userExists.id;
    await ticketService.postTicket({ ticketTypeId, enrollmentId });

    const ticket = await ticketService.getTicketByEnrollmentId(enrollmentId);
    if (!ticket) return res.sendStatus(httpStatus.NOT_FOUND);

    const ticketData = {
      id: ticket.id,
      status: ticket.status,
      ticketTypeId: ticket.ticketTypeId,
      enrollmentId: ticket.enrollmentId,

      TicketType: {
        id: ticket.TicketType.id,
        name: ticket.TicketType.name,
        price: ticket.TicketType.price,
        isRemote: ticket.TicketType.isRemote,
        includesHotel: ticket.TicketType.includesHotel,
        createdAt: ticket.TicketType.createdAt,
        updatedAt: ticket.TicketType.updatedAt,
      },
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };

    return res.status(httpStatus.CREATED).send(ticketData);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
  }
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const userExists = await ticketService.getEnrollmentByUserId(userId);
    if (!userExists) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    const enrollmentId: number = userExists.id;
    const ticket = await ticketService.getTicketByEnrollmentId(enrollmentId);
    if (!ticket) return res.sendStatus(httpStatus.NOT_FOUND);

    const ticketData = {
      id: ticket.id,
      status: ticket.status,
      ticketTypeId: ticket.ticketTypeId,
      enrollmentId: ticket.enrollmentId,

      TicketType: {
        id: ticket.TicketType.id,
        name: ticket.TicketType.name,
        price: ticket.TicketType.price,
        isRemote: ticket.TicketType.isRemote,
        includesHotel: ticket.TicketType.includesHotel,
        createdAt: ticket.TicketType.createdAt,
        updatedAt: ticket.TicketType.updatedAt,
      },
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };

    return res.status(httpStatus.OK).send(ticketData);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
  }
}
