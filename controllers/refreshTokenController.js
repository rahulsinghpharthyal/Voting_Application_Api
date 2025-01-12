import { catchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import User from "../modles/userSchema.js";
import jwt from 'jsonwebtoken';

const getRefreshToken = catchAsyncError(async(req, res, next)=>{
    const cookies = req.cookies;
    console.log('this is cookeis', req.cookies)
    if(!cookies?.Token) return next(new ErrorHandler('Please Login to acces!', 401)); // Forbidden
    const refreshToken = cookies.Token;
    const findUser = await User.findOne({refreshToken: refreshToken}).lean();
    if(!findUser) return next(new ErrorHandler('Please Login to access!', 401)); // Forbidden
    const {password: pwd, refreshToken: rft, ...userData} = findUser;
    console.log('thisis user', userData)
    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, 
        (err, decodedUser) => {
            if(err || findUser?._id.toString() !== decodedUser.id) return new ErrorHandler('Please Login to access', 401); // Forbidden
            const accessToken = jwt.sign({id: findUser?._id}, process.env.JWT_ACCESS_TOKEN, {expiresIn: '30s'})
            console.log('accessToken', accessToken)
            return res.status(200).json({ userData, accessToken});
        }
    )
})

export default getRefreshToken;