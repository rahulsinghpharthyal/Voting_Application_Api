import { catchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import User from "../modles/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Voter from "../modles/voterSchema.js";
// import aj from "../utils/arcjet.js";

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
      new ErrorHandler("Password must be at least 8 characters long", 400)
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
  return res
    .cookie("Token", refreshToken, cookieOptions)
    .status(200)
    .json({
      success: true,
      message: "Logged In Successfully",
      Data: { userData, accessToken },
    });
});

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
