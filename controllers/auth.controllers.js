import {User} from "../models/User.models.js";
import jwt from 'jsonwebtoken'
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
    // username, password
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
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new ApiError(401, "user name and password is not correct")
    }

    const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET);
    res
    .status(201)
    .json(
        new ApiResponse(200, token, "user login succesfully")
    );
})