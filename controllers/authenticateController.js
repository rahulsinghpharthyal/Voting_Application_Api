import { catchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import User from "../modles/userSchema.js";

const authenticate = catchAsyncError(async(req,res,next)=>{
        const {id} = req.user;
        // console.log('this is id', id)
        const foundUser = await User.findOne({_id: id});
        const {password, refreshToken, ...userData} = foundUser._doc;
        if(!foundUser) return next(new ErrorHandler('Invalid username or password', 404));
        return res.status(200).json({success:true, Data: userData});
})

export default authenticate;