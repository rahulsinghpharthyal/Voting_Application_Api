import { catchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import User from "../modles/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Voter from "../modles/voterSchema.js";
import sendEmail from "../utils/nodeMailer.js";
// import aj from "../utils/arcjet.js";

// Create the User:-
export const createUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ErrorHandler("Please Fill All Fields", 400));

  // Validate email using Arcjet
  // const decision = await aj.protect(req, { email: req.body.email, });
  // // Check if the decision indicates denial
  // console.log('this is decision', decision);
  // const conclusion = decision.conclusion;
  // const results = decision.results;
  // if (conclusion === "ERROR") {
  //   console.error("Arcjet validation error:", decision.reason);
  //   return next(new ErrorHandler("Error validating email address", 500));
  // }
  // if (results.some((result) => result.conclusion === "DENY")) {
  //   return next(new ErrorHandler("Invalid email address", 403));
  // }

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return next(new ErrorHandler("Email already Register", 400));

  if (password.length < 8)
    return next(
      new ErrorHandler(
        "Password must be at least 8 characters long and strong",
        400
      )
    );

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
  });
  return res
    .status(200)
    .json({ success: true, message: "Register Succesfully" });
});

// Login the User:-

export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!(email && password))
    return next(new ErrorHandler("Please fill all Fields", 400));

  const existingUser = await User.findOne({ email });
  if (!existingUser) return next(new ErrorHandler("Invalid Email", 400));

  const comparePassword = await bcrypt.compare(password, existingUser.password);
  if (!comparePassword)
    return next(new ErrorHandler("Invalid Email or Password", 400));

  const { password: pwd, refreshToken: rft, ...userData } = existingUser._doc;

  const accessToken = jwt.sign(
    { id: existingUser._id }, // payload
    process.env.JWT_ACCESS_TOKEN,
    { expiresIn: "30s" }
  );

  const refreshToken = jwt.sign(
    { id: existingUser._id },
    process.env.JWT_REFRESH_TOKEN,
    { expiresIn: "1d" }
  );

  await User.findOneAndUpdate(
    { _id: existingUser._id },
    { refreshToken: refreshToken },
    { new: true, runValidators: true }
  );

  const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };
  return res.cookie("Token", refreshToken, cookieOptions).status(200).json({
    success: true,
    message: "Logged In Successfully",
    Data: { userData, accessToken },
  });
});

// LogOut the User:-

export const logoutUser = catchAsyncError(async (req, res, next) => {
  // On client also delete the access Token
  const cookies = req.cookies;
  if (!cookies.Token) return next(new ErrorHandler("No Content", 204)); // No Content
  const refreshToken = cookies.Token;
  //Is Refresh Token in Database
  const findUser = await User.findOne({ refreshToken: refreshToken });
  if (!findUser) {
    res.clearCookie("Token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res.sendStatus(204);
  }

  // Delete the refeshToken in db

  await User.findOneAndUpdate(
    { refreshToken: refreshToken },
    { refreshToken: null },
    { new: true, runValidators: true }
  );
  res.clearCookie("Token", { httpOnly: true, sameSite: "none", secure: true }); // secrue True: only serves on https
  return res.status(200).json({ success: true, message: "Logout Succesfully" });
});

// Get All Voter:-

export const getAllVoter = catchAsyncError(async (req, res) => {
  const allVoter = await User.find({ role: "voter" });
  const voterWithVoteStatus = await Promise.all(
    allVoter.map(async (voter) => {
      const voteDetails = await Voter.findOne({ userId: voter._id });
      return {
        ...voter._doc,
        hasVoted: voteDetails ? voteDetails.hasVoted : false,
      };
    })
  );
  return res.status(200).json({ success: true, Data: voterWithVoteStatus });
});

// Forgot Password:-

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  console.log("this is eai", req.body);
  const findUser = await User.findOne({ email: email });
  if (!findUser) return next(new ErrorHandler("Email Id not register", 400));
  const otp = Math.floor(1000 + Math.random() * 9000);
  findUser.resetPasswordOTP = otp;
  findUser.resetPasswordExpires = Date.now() + 3600000;
  await findUser.save();
  const resetURL = process.env.CLIENT_URI_LIVE + `/reset-password?token=${otp}`;
  try {
    await sendEmail(
      email,
      process.env.EMAIL,
      "Password Reset",
      `You are receiving this because you have requested to reset the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n${resetURL}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n OTP for reset the password: ${otp}\n`
    );
    return res.status(200).json("Password reset email sent.");
  } catch (error) {
    return next(new ErrorHandler("Error sending email", 500));
  }
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { otp, password } = req.body;
  if (!(otp && password)) return next(new ErrorHandler("Please fill all fields"));
  const user = await User.findOne({
    resetPasswordOTP: otp,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    // user.resetPasswordOTP = null,
    // user.resetPasswordExpires = null,
    // await User.save();
    return next(new ErrorHandler("Password reset token is invalid or has expired.", 400));
  }

  if (password.length < 8)
    return next(
      new ErrorHandler(
        "Password must be at least 8 characters long and strong",
        400
      )
    );

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordOTP = null;
  user.resetPasswordExpires = null;

  await user.save();
  return res
    .status(200)
    .json("Password has been reset successfully. Please log in");
});
