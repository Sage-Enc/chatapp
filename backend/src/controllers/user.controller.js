import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js"
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"

const options = {
    httpOnly: true,
    secure: true
}

const registerUser = asyncHandler(async (req, res)=>{
    const {fullName, uName, email, password} = req.body;

    if([fullName, uName, email, password].some(field => field==="")){
        throw new apiError(400, "Few Fields Are Empty. Please Enter Data.");
    }

    const existingUser = await User.findOne({
        $or: [{uName}, {email}]
    })

    if(existingUser){
        throw new apiError(400, "User with same Username or Email Already Exists.");
    }

    const newUser = await User.create({
        fullName,
        uName,
        email,
        password
    })

    const user = await User.findById(newUser._id).select("-password");

    if(!user){
        throw new apiError(500, "User Registration Unsuccessful.")
    }

    return res
    .status(200)
    .json(new apiResponse(200, user, "User Registration Successful"));
})

const loginUser = asyncHandler(async (req, res)=>{
    const {uName, email, password} = req.body;

    if(!uName && !email){
        throw new apiError(400, "Username or Password Required");
    }

    const user = await User.findOne({
        $or: [{uName}, {email}]
    })

    if(!user){
        throw new apiError(400, "No Such User Exists");
    }

    const validPassword = await user.isPasswordCorrect(password);

    if(!validPassword){
        throw new apiError(400, "Invalid Password Detected.")
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({validateBeforeSave: false});

    const loggedUser = await User.findById(user._id).select("-password -refreshToken");

    return res
    .status(200)
    .cookie("accessToken". accessToken, options)
    .cookie("refreshToken". refreshToken, options)
    .json(new apiResponse(200, loggedUser, "User Logged in Successfully."))
})

const logoutUser = asyncHandler(async (req, res)=>{
    const incomingUser = req.user;

    if(!incomingUser){
        throw new apiError(400, "No User Logged In");
    }

    const user = await User.findByIdAndUpdate(
        user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    return res
    .status(200)
    .clearCookie(accessToken, options)
    .clearCookie(refreshToken, options)
    .json(new apiResponse(200, null, "User Logged Out Successfully"))
})

export {registerUser}