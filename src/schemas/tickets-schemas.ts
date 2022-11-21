import Joi from "joi";
import { Ticket } from "@prisma/client";

type TicketTypeId = Pick<Ticket, "ticketTypeId">;

export const ticketTypeIdSchema = Joi.object<TicketTypeId>({
  ticketTypeId: Joi.number().required(),
});
