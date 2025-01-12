import { catchAsyncError } from "../middleware/catchAsyncErrors.js";
import User from "../modles/userSchema.js";
import ErrorHandler from "../middleware/error.js";
import Voter from "../modles/voterSchema.js";

export const registerForVoting = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, aadharNo, state, district, dateOfBirth } = req.body;
  const existingUser = await User.findById({ _id: id });
  if (!existingUser)
    return next(new ErrorHandler("Please Login to Register for Voting", 400));
  const existingVoter = await Voter.findOne({ userId: id });
  if (existingVoter)
    return next(new ErrorHandler("You are already register", 400));

  const existingAddharNumber = await Voter.findOne({ aadharNo });
  if (existingAddharNumber)
    return next(new ErrorHandler("Aadhar Number already exists", 400));

  //calculate the age;
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };
  const age = calculateAge(dateOfBirth);
  const createVoter = await Voter.create({
    userId: existingUser._id,
    name,
    aadharNo,
    state,
    district,
    dateOfBirth,
    age,
  });
  return res
    .status(200)
    .json({
      success: true,
      message: "Register Successfull! You are eligible for Voting",
    });
});

export const getAllVoter = catchAsyncError(async (req, res, next) => {
  const getAllVoter = await Voter.find({});
  return res.status(200).json(getAllVoter);
});
