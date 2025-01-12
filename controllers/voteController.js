import { catchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import Candidate from "../modles/candidateSchema.js";
import Voter from "../modles/voterSchema.js";
import Vote from "../modles/voteSchema.js";

export const createVote = catchAsyncError(async (req, res, next) => {
  const { candidateId } = req.body;
  const { userId } = req.params;
  console.log(candidateId, userId);
  if (!candidateId)
    return next(new ErrorHandler("Candidate Not Enrolled", 400));
  const voterId = await Voter.findOne({ userId: userId });
  if (!voterId)
    return next(
      new ErrorHandler("You have are not register to give Vote", 400)
    );
  if (voterId.isVoted === true)
    return next(new ErrorHandler("You already Voted", 400));

  const updatedCandidate = await Candidate.findByIdAndUpdate(
    { _id: candidateId },
    { $inc: { votesReceived: 1 } },
    { new: true, runValidators: true }
  );
  if (!updatedCandidate) {
    console.log("Candidate not found");
  } else {
    console.log("Updated Candidate:", updatedCandidate);
  }

  const updateVoter = await Voter.findByIdAndUpdate(
    { _id: voterId._id },
    { $set: { isVoted: true, votingDate: new Date() } },
    { new: true, runValidators: true }
  );

  const alreadyVote = await Vote.findOne({ voterId: voterId._id });
  if (alreadyVote) return next(new ErrorHandler("Already Voted!", 400));

  const createVote = await Vote.create({
    voterId: voterId._id,
    candidateId: candidateId,
  });

  return res
    .status(200)
    .json({ success: true, message: "Vote Successfully Done." });
});

export const totalVotes = catchAsyncError(async (req, res, next) => {
  const totalVotes = (await Vote.find({})).length;
  return res.status(200).json(totalVotes);
});
