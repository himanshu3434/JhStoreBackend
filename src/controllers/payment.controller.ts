import { stripe } from "../app.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return res
    .status(200)
    .json(
      new apiResponse(
        true,
        200,
        { clientSecret: paymentIntent.client_secret },
        "Payment intent created SuccessFully"
      )
    );
});
