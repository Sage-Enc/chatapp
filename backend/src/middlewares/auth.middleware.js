import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import User from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next)=>{
   try{
    const incomingToken = req.cookie("accessToken");

    if(!incomingToken){
        throw new apiError(400, "No User Logged In");
    }

    const decodedToken = await jwt.verify(incomingToken, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select("-password -refreshToken");

    if(!user){
        throw new apiError(400, "Invalid Access Token");
    }

    req.user = user;
    next();
   }catch(err){
    throw new apiError(400, err?.message || "Invalid Token Message")
   }
})