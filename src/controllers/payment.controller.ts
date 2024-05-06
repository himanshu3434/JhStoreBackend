import { stripe } from "../app.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  console.log("amount  ", amount);
  if (!amount)
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "Amount is Required"));

  const customer = await stripe.customers.create({
    name: "Raju Rastogi",
    email: "example@example.com",
    address: {
      city: "kasokaba",
      country: "japan",
      line1: "shinchan streeet",
      line2: "",
      postal_code: "226005",
      state: "tokyo",
    },
  });

  const paymentIntent = await stripe.paymentIntents.create({
    description: "lo regulation",
    customer: customer.id,
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
