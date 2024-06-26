import { Coupon } from "../models/coupon.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  if (!coupon || coupon.trim().lenght === 0)
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "Coupon is Required"));
  const dbCoupon = await Coupon.find({ name: coupon });
  // console.log(dbCoupon);
  if (!dbCoupon || dbCoupon.length === 0)
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "Coupon Not Found"));

  return res
    .status(200)
    .json(new apiResponse(true, 200, null, "Coupon  is Valid"));
});
//admin controller
const addCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;

  const existingCoupon = await Coupon.find({ name: coupon });
  // console.log(existingCoupon);
  if (existingCoupon && existingCoupon.length !== 0)
    return res
      .status(409)
      .json(new apiResponse(false, 409, null, "coupon already exist "));

  const newCoupon = await Coupon.create({
    name: coupon,
  });
  if (!newCoupon)
    return res
      .status(500)
      .json(
        new apiResponse(
          false,
          500,
          null,
          "database error while creating the coupon in the database"
        )
      );

  return res
    .status(200)
    .json(new apiResponse(true, 200, newCoupon, "Coupon created SuccessFully"));
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;

  if (!coupon)
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "Coupon name is required"));

  const deleteResponse = await Coupon.findOneAndDelete({ name: coupon });

  if (!deleteResponse)
    return res
      .status(500)
      .json(new apiResponse(false, 404, null, "Coupon Does Not Exist"));

  return res
    .status(200)
    .json(
      new apiResponse(true, 200, deleteCoupon, "Coupon deleted Successfully")
    );
});

export { addCoupon, deleteCoupon, getCoupon };
