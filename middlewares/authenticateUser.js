import jwt from "jsonwebtoken"
import sendResponce from "../helpers/sendResponce.js"

export default function authenticateUser(req, res, next) {
    try {
         const { authorization } = req.headers
         const token = authorization.split(' ')[1]

         if(!token) return sendResponce(res, 402, null, true, "Token Not Provided")
         const user = jwt.verify(token, process.env.AUTH_SECRATE)

         if(user) {
             req.user = user
             next()
         } else {
             sendResponce(res, 402, null, true, "Invalied Token")
         }

    } catch (e) {
        console.log("Internal Server error")
    }
}