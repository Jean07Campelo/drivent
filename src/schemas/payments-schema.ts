import Joi from "joi";

type PaymentType = 
{
  ticketId: number,
  cardData: {
    issuer: string,
    number: number | string,
    name: string,
    expirationDate: Date,
    cvv: number
  }
}

export const paymentSchema = Joi.object<PaymentType>({
  ticketId: Joi.number().required(),
  cardData: Joi.object({
    issuer: Joi.string().min(1).required(),
    number: Joi.number().min(16).required(),
    name: Joi.string().min(1).required(),
    expirationDate: Joi.string().required(),
    cvv: Joi.number().min(3).required()
  }),
});
