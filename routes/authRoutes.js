import express from "express";
import Joi from "joi";
import sendResponce from "../helpers/sendResponce.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

const router = express.Router()

const registerSchema = Joi.object({
    fullname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(10).required()
})

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(10).required()
})

router.post("/register", async (req, res) => {
    try {
        const { error, value } = registerSchema.validate(req.body)
        const { email, password } = value

        if (error) return sendResponce(res, 404, null, true, error.message)

        const user = await User.findOne({ email })
        if (user) return sendResponce(res, 402, null, true, "You are already register please login")


        const hashPassword = await bcrypt.hash(password, 10)
        value.password = hashPassword


        let newUser = new User({ ...value })
        newUser = await newUser.save()

        sendResponce(res, 201, newUser, false, "User created, successfuly")
    } catch (e) {
        console.log("Internal server error", e)
    }
})

router.post("/login", async (req, res) => {
    try {
        const { error, value } = loginSchema.validate(req.body)
        const { email, password } = value

        if (error) return sendResponce(res, 404, null, true, error.message)

        const user = await User.findOne({ email })
        if (!user) return sendResponce(res, 402, null, true, "You are not register")

        const checkPassword = bcrypt.compare(password, user.password)
        if(!checkPassword) return sendResponce(res, 404, null, true, "Invalied Credentials")

        const token = jwt.sign({...value}, process.env.AUTH_SECRATE)
        sendResponce(res, 201, {user,token }, false, "User created, successfuly")
    } catch (e) {
        console.log("Internal server error", e)
    }
})

export default router