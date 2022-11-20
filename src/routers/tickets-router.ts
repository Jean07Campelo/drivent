import { Router } from "express";
import { getTicketsTypes } from "@/controllers";

const ticketsRouter = Router();

ticketsRouter.get("/types", getTicketsTypes);

export { ticketsRouter };
