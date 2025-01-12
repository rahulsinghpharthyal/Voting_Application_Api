import { catchAsyncError } from "../middleware/catchAsyncErrors.js";
import State from "../modles/stateSchema.js";

export const getState = catchAsyncError(async (req, res, next)=>{
        const states = await State.find({});
        return res.status(200).json({ states });
      });
      