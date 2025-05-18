import {User} from "../models/User.models.js";
import jwt from 'jsonwebtoken'
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

export const register = asyncHandler(async (req, res) => {
    // username, password
    // check user already exits
    // hash password
    // create user

    const {username, password} = req.body;
    if(!username || ! password){
        throw new ApiError(400, "username and password is required")
    }
   
     const exitedUser = await User.findOne({
        $or : [{username}]
     })
     if (exitedUser) {
        throw new ApiError(401, "User already exits");
     }

        const user = await User.create({username, password });
        if (!user) {
            throw new ApiError(500, "user register is falied")
        }
        const createdUser = await User.findById(user._id).select("-password")

        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while user register")
        }
        res
        .status(201)
        .json(
           new ApiResponse(201, createdUser, "user created succefully")
        )
    
})

export const login = asyncHandler(async (req, res) => {
    const {username, password} = req.body;

    if(!username || ! password){
        throw new ApiError(400, "username and password is required")
    }

    const user = await User.findOne({username});

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password ")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


    // return res
    // .status(200)
    // .cookie("accessToken", accessToken)
    // .cookie("refershToken", refreshToken)
    // .json(
    //     new ApiResponse (200, 
    //         {
    //             user : loggedInUser, accessToken, refreshToken
    //         },
    //         "User logged is successfully"
    //     )
    // )

    const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET);
    res
    .status(201)
    .json(
        new ApiResponse(200, token, "user login succesfully")
    );
    
})

export const changePassword = asyncHandler (async (req, res) => {
    const {oldPassword, newPassword} = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "password is required")
    }

    const user = await User.findById(req.userId);
    if (!user) {
        throw new ApiError(401, "user id required ")
    }
    const isMatch = await user.isPasswordCorrect(oldPassword);
    if (!isMatch) {
        throw new ApiError(401, "Password is not correct")
    }
    user.password = newPassword;
    await user.save();
    res
    .status(200)
    .json(
        new ApiResponse(201, {}, "user password is change successfully")
    )
})