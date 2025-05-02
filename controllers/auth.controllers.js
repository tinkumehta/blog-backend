import User from "../models/User.models.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    // username, password
    // hash password
    // create user

    const {username, password} = req.body;
    if (!username || !password) {
        res.status(201).json({error : "username and password is required"})
    }
    const hash = await bcrypt.hash(password, 10);
    try {
        const user = await User.create({username, password: hash});
        res
        .status(201)
        .json(
            {message : 'User created succefully', userId : user._id}
        )
    } catch (error) {
        res.status(400).json({error : "Username taken"})
    }
}

export const login = async (req, res) => {
    const {username, password} = req.body;

    const user = await User.findOne({username});
    if (!user || !(await bcrypt.compare(password, user.password))) {
        res
        .status(401)
        .json({error : 'Invalid credentials'})
    }

    const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET);
    res.json({token});
}