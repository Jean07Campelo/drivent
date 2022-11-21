import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { paymentSchema } from "@/schemas";
import { postPayment, getTicket } from "@/controllers";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .post("/process", validateBody(paymentSchema), postPayment)
  .get("", getTicket);

export { paymentsRouter };
