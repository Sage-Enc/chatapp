import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    fullName: {
        type: String,
        trim: true,
        index: true,
        required: [true, "Full Name Required"]
    },
    uName: {
        type: String,
        trim: true,
        unique: true,
        index: true,
        lowercase: true,
        required: [true, "Username Required"]
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        index: true,
        lowercase: true,
        required: [true, "Email Required"]
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password Required"],
        min: [8, "Password Too Short"],
        max: 20
    },
    avatar: {
        type: String
    },
    accessToken: {
        type: String
    },
    refreshToken: {
        type: String
    }
},
{
    timestamps: true
});

userSchema.pre('save', async function(){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next()
});

userSchema.method.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
};

userSchema.method.generateAccessToken = async function(){
    return await jwt.sign({
        _id: this._id,
        fullName: this.fullName,
        uName: this.uName,
        email: this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
};

userSchema.method.generateRefreshToken = async function(){
    return await jwt.sign({
        _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
};

const User = mongoose.model("User", userSchema);

export default User;