import jwt from 'jsonwebtoken';
import { catchAsyncError } from './catchAsyncErrors.js';
import ErrorHandler from './error.js';


const isAuthenticated = catchAsyncError(async(req, res, next)=> {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    // console.log('thisis authHeader', authHeader)
    if(!authHeader) return next(new ErrorHandler('Please Login to access',403));
    // console.log(authHeader); // Bearer token
    const token = authHeader.split(' ')[1];
    if(!token) return next(new ErrorHandler("Token unavailable", 401))
    jwt.verify(
        token,
        process.env.JWT_ACCESS_TOKEN,
        (err, decoded) => {
            if(err) return next(new ErrorHandler('Forbidden', 403)) // Invalid Token
            req.user = decoded;
            next();
        }
    )
})

export default isAuthenticated;