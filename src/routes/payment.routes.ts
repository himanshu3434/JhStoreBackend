import { Router } from "express";
import { createPaymentIntent } from "../controllers/payment.controller.js";

const paymentRouter = Router();

paymentRouter.post("/create", createPaymentIntent);

export { paymentRouter };
