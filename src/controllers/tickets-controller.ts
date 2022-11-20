import { Request, Response } from "express";
import httpStatus from "http-status";
import ticketService from "@/services/tickets-service";

export async function getTicketsTypes(req: Request, res: Response) {
  try {
    const ticketsTypes = await ticketService.getManyTickets();
    return res.status(httpStatus.OK).send(ticketsTypes);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
