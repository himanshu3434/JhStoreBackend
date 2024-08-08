import { stripe } from "../app.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, userData } = req.body;

  if (!amount)
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "Amount is Required"));

  const customer = await stripe.customers.create({
    name: userData.fullName,
    email: userData.email,
    address: {
      city: "NA",
      country: userData.country,
      line1: userData.address,
      line2: "",
      postal_code: userData.pincode,
      state: userData.state,
    },
  });

  const paymentIntent = await stripe.paymentIntents.create({
    description: "Payment of a customer of jhstore ",
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
