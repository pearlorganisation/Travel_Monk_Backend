import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import { razorpayInstance } from "../../configs/razorpay/razorpay.js";
import crypto from "crypto";
import { nanoid } from "nanoid";
import PreBuiltPackageBooking from "../../models/booking/preBuiltPackageBooking.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { sendBookingConfirmationMail } from "../../utils/Mail/emailTemplates.js";
import { paginate } from "../../utils/pagination.js";
import User from "../../models/user/user.js";
import generateBookingId from "../../utils/generateBookingId.js";
import PreBuiltPackageEnquiryBooking from "../../models/booking/preBuiltPackageEnquiryBooking.js";
import PreBuiltPackageCustomizationEnquiry from "../../models/customizationEnquiry/preBuiltPackageCustomizationEnquiry.js";
import FullyCustomizePackageEnquiryBooking from "../../models/booking/fullyCustomizePackageEnquiryBooking.js";
import FullyCustomizeEnquiry from "../../models/customizationEnquiry/fullyCustomizationEnquiry.js";

export const createBooking = asyncHandler(async (req, res, next) => {
  const { totalPrice, packageId, numberOfTravellers } = req.body;
  const options = {
    amount: totalPrice * 100, // Convert amount to smallest unit (paise for INR)
    currency: "INR",
    receipt: `order_rcptid_${nanoid(8)}${Date.now()}`, // Generate unique receipt id
  };

  // Create the order using Razorpay instance
  try {
    const order = await razorpayInstance.orders.create(options);
    const preBuiltPackageBooking = await PreBuiltPackageBooking.create({
      bookingId: generateBookingId(),
      user: req.user._id,
      packageId,
      numberOfTravellers,
      totalPrice,
      bookingStatus: "Pending",
      paymentStatus: "Unpaid",
      razorpay_order_id: order.id,
    });

    res.status(200).json({
      success: true,
      order,
      bookingId: preBuiltPackageBooking.bookingId,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error); // Log the complete error object for debugging
    return next(new ApiErrorResponse("Failed to create Razorpay order", 500));
  }
});

export const verifyPayment = asyncHandler(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    const booking = await PreBuiltPackageBooking.findOneAndUpdate(
      { razorpay_order_id },
      { paymentStatus: "Advanced_Paid", bookingStatus: "Completed" },
      { new: true }
    )
      .populate("user", "email name")
      .populate("packageId", "name");

    if (booking) {
      await sendBookingConfirmationMail(
        booking.user?.email, // Recipient's email
        {
          name: booking.user.name,
          bookingId: booking.bookingId,
          packageName: booking.packageId.name,
          numberOfTravellers: booking.numberOfTravellers,
          totalPrice: booking.totalPrice,
        }
      )
        .then(() => {
          return res.status(200).json({
            success: true,
            message:
              "Mail sent successfully. Please check your email, including the spam or junk folder to verify your account",
          });
        })
        .catch((error) => {
          res.status(400).json({
            success: false,
            message: `Unable to send mail: ${error.message}`,
          });
        });
    }

    res.status(200).json({
      success: true,
      message: "Payment verified and booking confirmed",
    });
  } else {
    res
      .status(400)
      .json({ success: false, message: "Payment verification failed" });
  }
});

export const getAllBookings = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const filter = {};
  const { name, paymentStatus } = req.query;
  if (name) {
    const user = await User.find({ name: { $regex: name, $options: "i" } });
    if (!user || user.length === 0) {
      return next(new ApiErrorResponse("No user found", 404));
    }
    const userId = user.map((user) => user._id);
    filter.user = { $in: userId };
  }

  if (paymentStatus) {
    filter["$text"] = { $search: paymentStatus };
  }
  const sortOptions = {};
  switch (req.query.sortBy) {
    case "price-asc":
      sortOptions.totalPrice = 1;
      break;
    case "price-desc":
      sortOptions.totalPrice = -1;
      break;
  }

  const { data: preBuiltPackageBookings, pagination } = await paginate(
    PreBuiltPackageBooking,
    page,
    limit,
    [
      { path: "user", select: "-password -refreshToken -role" },
      { path: "packageId" }, // Can choose what to select
    ],
    filter,
    "",
    sortOptions
  );

  if (!preBuiltPackageBookings || preBuiltPackageBookings.length === 0) {
    return next(
      new ApiErrorResponse("No pre built package bookings found", 404)
    );
  }

  return res.status(200).json({
    success: true,
    message: "Pre built packages bookings found successfully",
    pagination,
    data: preBuiltPackageBookings,
  });
});

export const myBookings = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "10");

  const { data: preBuiltPackageBookings, pagination } = await paginate(
    PreBuiltPackageBooking,
    page,
    limit,
    [
      { path: "user", select: "-password -refreshToken -role" },
      { path: "packageId" }, // Can choose what to select
    ],
    { user: req.user._id }
  );
  if (!preBuiltPackageBookings || preBuiltPackageBookings.length === 0) {
    return next(
      new ApiErrorResponse("No pre buil package bookings found", 400)
    );
  }
  return res.status(200).json({
    success: true,
    message: "Pre built packages bookings found successfully",
    pagination,
    data: preBuiltPackageBookings,
  });
});

export const getBookingById = asyncHandler(async (req, res, next) => {
  const booking = await PreBuiltPackageBooking.findOne({
    bookingId: req.params.bookingId,
  })
    .populate("user", "email name")
    .populate("packageId");

  if (!booking) {
    return next(
      new ApiErrorResponse("No pre built package booking found", 404)
    );
  }

  return res.status(200).json({
    success: true,
    message: "Pre built package booking found successfully",
    data: booking,
  });
});

// ====== PreBuiltPackageEnquiryBooking ======

export const createPreBuiltPackageEnquiryBooking = asyncHandler(
  async (req, res, next) => {
    const { advancedPayment } = req.body;
    const { id } = req.params; // of PreBuiltPackageCustomizationEnquiry

    const preBuiltPackageCustomizationEnquiry =
      await PreBuiltPackageCustomizationEnquiry.findById(id);
    if (!preBuiltPackageCustomizationEnquiry) {
      return next(
        new ApiErrorResponse("No pre built package enquiry found", 404)
      );
    }

    if (advancedPayment < 5000) {
      return next(
        new ApiErrorResponse("Advanced payment should be atleast ₹5,000", 400)
      );
    }

    const options = {
      amount: advancedPayment * 100, // Convert amount to smallest unit (paise for INR)
      currency: "INR",
      receipt: `order_rcptid_${nanoid(8)}${Date.now()}`, // Generate unique receipt id
    };

    // Create the order using Razorpay instance
    try {
      const order = await razorpayInstance.orders.create(options);
      const preBuiltPackageEnquiryBooking =
        await PreBuiltPackageEnquiryBooking.create({
          bookingId: generateBookingId(),
          user: req.user._id,
          preBuiltPackageEnquiry: id,
          advancedPayment,
          bookingStatus: "Pending",
          paymentStatus: "Unpaid",
          razorpay_order_id: order.id,
        });

      res.status(200).json({
        success: true,
        message: "Pre built package enquiry booking order created successfully",
        order,
        bookingId: preBuiltPackageEnquiryBooking.bookingId,
      });
    } catch (error) {
      console.error("Error creating Razorpay order:", error); // Log the complete error object for debugging
      return next(new ApiErrorResponse("Failed to create Razorpay order", 500));
    }
  }
);

export const verifyPreBuiltPackageEnquiryPayment = asyncHandler(
  async (req, res, next) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      const booking = await PreBuiltPackageEnquiryBooking.findOneAndUpdate(
        { razorpay_order_id },
        {
          paymentStatus: "Advanced_Paid",
          bookingStatus: "Advance_Payment_Complete",
        },
        { new: true }
      )
        .populate("user", "email name")
        .populate({
          path: "preBuiltPackageEnquiry",
          populate: { path: "package.packageId", select: "name" },
        });
      if (!booking) {
        return next(
          new ApiErrorResponse(
            "No pre built package enquiry booking found",
            404
          )
        );
      }
      try {
        await sendBookingConfirmationMail(
          booking.user?.email, // Recipient's email
          {
            name: booking.user.name,
            bookingId: booking.bookingId,
            packageName: booking.preBuiltPackageEnquiry.package.name,
            numberOfTravellers:
              booking.preBuiltPackageEnquiry.numberOfTravellers,
            advancedPayment: booking.advancedPayment,
          }
        );
        return res.status(200).json({
          success: true,
          message:
            "Mail sent successfully. Please check your email, including the spam or junk folder to verify your account",
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: `Unable to send mail: ${error.message}`,
        });
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  }
);

// if user is accessing this endpoint we get id of user from request, if admin is accessing this endpoint we get all bookings
export const getAllPreBuiltPackageEnquiryBookings = asyncHandler(
  async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filter = {};

    console.log(req.user);
    if (req.user.role !== "ADMIN") {
      filter.user = req.user._id;
    }
    const { name, paymentStatus } = req.query;
    if (name) {
      const user = await User.find({ name: { $regex: name, $options: "i" } });
      if (!user || user.length === 0) {
        return next(new ApiErrorResponse("No user found", 404));
      }
      const userId = user.map((user) => user._id);
      filter.user = { $in: userId };
    }

    if (paymentStatus) {
      filter["$text"] = { $search: paymentStatus };
    }

    const sortOptions = {};
    switch (req.query.sortBy) {
      case "price-asc":
        sortOptions.totalPrice = 1;
        break;
      case "price-desc":
        sortOptions.totalPrice = -1;
        break;
    }

    const { data: preBuiltPackageEnquiryBookings, pagination } = await paginate(
      PreBuiltPackageEnquiryBooking,
      page,
      limit,
      [
        {
          path: "user",
          select: "-password -refreshToken -role -createdAt -updatedAt",
        },
        {
          path: "preBuiltPackageEnquiry",
          populate: { path: "package.packageId", select: "name" },
        },
      ],
      filter
    );

    return res.status(200).json({
      success: true,
      message:
        preBuiltPackageEnquiryBookings.length === 0
          ? "No pre built package enquiry bookings found"
          : "Pre built package enquiry bookings found successfully",
      pagination,
      data: preBuiltPackageEnquiryBookings,
    });
  }
);

// ================ FullyCustomizePackageEnquiryBooking ==========

export const createFullyCustomizeEnquiryBooking = asyncHandler(
  async (req, res, next) => {
    const { advancedPayment } = req.body;
    const { id } = req.params; // of PreBuiltPackageCustomizationEnquiry

    const fullyCustomizeEnquiry = await FullyCustomizeEnquiry.findById(id);
    if (!fullyCustomizeEnquiry) {
      return next(
        new ApiErrorResponse("No fully customize package enquiry found", 404)
      );
    }

    if (advancedPayment < 5000) {
      return next(
        new ApiErrorResponse("Advanced payment should be atleast ₹5,000", 400)
      );
    }
    const options = {
      amount: advancedPayment * 100, // Convert amount to smallest unit (paise for INR)
      currency: "INR",
      receipt: `order_rcptid_${nanoid(8)}${Date.now()}`, // Generate unique receipt id
    };
    // Create the order using Razorpay instance
    try {
      const order = await razorpayInstance.orders.create(options);
      const fullyCustomizePackageEnquiryBooking =
        await FullyCustomizePackageEnquiryBooking.create({
          bookingId: generateBookingId(),
          user: req.user._id,
          fullyCustomizePackageEnquiry: id,
          advancedPayment,
          bookingStatus: "Pending",
          paymentStatus: "Unpaid",
          razorpay_order_id: order.id,
        });

      res.status(200).json({
        success: true,
        message: "Fully customized enquiry booking order created successfully",
        order,
        bookingId: fullyCustomizePackageEnquiryBooking.bookingId,
      });
    } catch (error) {
      console.error("Error creating Razorpay order:", error); // Log the complete error object for debugging
      return next(new ApiErrorResponse("Failed to create Razorpay order", 500));
    }
  }
);

export const verifyFullyCustomizeEnquiryPayment = asyncHandler(
  async (req, res, next) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      const booking =
        await FullyCustomizePackageEnquiryBooking.findOneAndUpdate(
          { razorpay_order_id },
          {
            paymentStatus: "Advanced_Paid",
            bookingStatus: "Advance_Payment_Complete",
          },
          { new: true }
        )
          .populate("user", "email name")
          .populate({
            path: "fullyCustomizePackageEnquiry",
            populate: { path: "destination", select: "name" },
          });

      if (!booking) {
        return next(
          new ApiErrorResponse("No fully customize enquiry booking found", 404)
        );
      }

      try {
        await sendBookingConfirmationMail(
          booking.user?.email, // Recipient's email
          {
            name: booking.user.name,
            bookingId: booking.bookingId,
            destinationName: booking.fullyCustomizePackageEnquiry.name,
            numberOfTravellers:
              booking.fullyCustomizePackageEnquiry.numberOfTravellers,
            advancedPayment: booking.advancedPayment,
          }
        );

        return res.status(200).json({
          success: true,
          message:
            "Mail sent successfully. Please check your email, including the spam or junk folder.",
        });
      } catch (error) {
        console.log(error);
        res.status(400).json({
          success: false,
          message: `Unable to send mail: ${error.message}`,
        });
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  }
);

export const getAllFullyCustomizeEnquiryBookings = asyncHandler(
  async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filter = {};

    console.log(req.user);
    if (req.user.role !== "ADMIN") {
      filter.user = req.user._id;
    }
    const { name, paymentStatus } = req.query;
    if (name) {
      const user = await User.find({ name: { $regex: name, $options: "i" } });
      if (!user || user.length === 0) {
        return next(new ApiErrorResponse("No user found", 404));
      }
      const userId = user.map((user) => user._id);
      filter.user = { $in: userId };
    }

    if (paymentStatus) {
      filter["$text"] = { $search: paymentStatus };
    }

    const sortOptions = {};
    switch (req.query.sortBy) {
      case "price-asc":
        sortOptions.totalPrice = 1;
        break;
      case "price-desc":
        sortOptions.totalPrice = -1;
        break;
    }

    const { data: fullyCustomizePackageEnquiryBooking, pagination } =
      await paginate(
        FullyCustomizePackageEnquiryBooking,
        page,
        limit,
        [
          {
            path: "user",
            select: "-password -refreshToken -role -createdAt -updatedAt",
          },
          {
            path: "fullyCustomizePackageEnquiry",
            populate: [
              { path: "destination", select: "name" },
              { path: "selectedVehicle", select: "vehicleName" },
            ],
          },
        ],
        filter
      );

    return res.status(200).json({
      success: true,
      message:
        fullyCustomizePackageEnquiryBooking.length === 0
          ? "No fully customized enquiry bookings found"
          : "Fully customized enquiry bookings found successfully",
      pagination,
      data: fullyCustomizePackageEnquiryBooking,
    });
  }
);
