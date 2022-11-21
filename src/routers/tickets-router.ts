import { Router } from "express";
import { getTicketsTypes, postTicket, getTickets } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { ticketTypeIdSchema } from "@/schemas";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getTicketsTypes)
  .post("/", validateBody(ticketTypeIdSchema), postTicket)
  .get("/", getTickets);

export { ticketsRouter };
