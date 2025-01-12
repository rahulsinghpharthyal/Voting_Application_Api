import { catchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import Candidate from "../modles/candidateSchema.js";
import Voter from "../modles/voterSchema.js";

export const createCandidate = catchAsyncError(async (req, res, next) => {
  const { candidateAahaarId, candidatename, party } = req.body;
  if (!(candidateAahaarId, candidatename || party))
    return next(
      new ErrorHandler("Please fill the candidatename and Patry Properlly", 400)
    );

  const existingCandidate = await Candidate.findOne({
    aadhaarId: candidateAahaarId,
  });
  if (existingCandidate)
    return next(new ErrorHandler("Candiate also Registerd", 400));

  const newCandidate = new Candidate({
    aadhaarId: candidateAahaarId,
    candidatename,
    party,
  });
  await newCandidate.save();
  return res.status(200).json({ success: true, message: "Candidate Enrolled" });
});

export const updateCandidate = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { candidatename, party } = req.body;
  const updatedCandidate = await Candidate.findByIdAndUpdate(
    { _id: id },
    { $set: { candidatename, party } },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updateCandidate)
    return next(new ErrorHandler("Candiate not Found", 404));

  return res
    .status(200)
    .json({ succes: true, message: "Enrolled Candidate Updated" });
});

export const getCandidates = catchAsyncError(async (req, res, next) => {
  const allCandidates = await Candidate.find({});
  return res.status(200).json({ success: true, Data: allCandidates });
});

export const getCandidateByUser = catchAsyncError(async (req, res, next)=>{
    const {id} = req.params;
    const existingVoter = await Voter.findOne({userId: id});
    if(!existingVoter)return next(new ErrorHandler('Please Register for vote!'), 400);
    const filterCandidate = await Candidate.find({state: existingVoter.state});
    if(!filterCandidate.length)return next(new ErrorHandler('There are no Election for now'), 400)
      return res.status(200).json({data: filterCandidate});
})

export const deleteCandidate = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const deleteCandidate = await Candidate.findByIdAndDelete({ _id: id });
  if (!deleteCandidate)
    return next(new ErrorHandler("Candidate Not Found", 404));
  return res.status(200).json({ succes: true, message: "Candidate Deleted" });
});


//this is for temporary for upadting the party in database;

export const updateParty = catchAsyncError(async (req, res, next) => {
  const filter = { party: 'Aam Aadmi Party (AAP)' }; // Example filter based on party from request body
  const update = { $set: { electionSymbol: 'https://res.cloudinary.com/dg56sdt6k/image/upload/v1736248566/Aam_Aadmi_Party_logo__English_.svg_roda4k.png' } }; // Update electionSymbol from request body

  const result = await Candidate.updateMany(filter, update);
  res.status(200).json({
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      message: "Documents updated successfully."
})
});
