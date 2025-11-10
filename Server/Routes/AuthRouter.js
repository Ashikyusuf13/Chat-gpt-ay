import express from "express"
import { getUser, loginUser, LogoutUser, register } from "../Controller/Usercontroller.js"
import { protectuser } from "../Middleware/auth.js"

const AuthRouter = express.Router()

AuthRouter.post("/register", register)
AuthRouter.post("/login", loginUser)
AuthRouter.post("/logout",LogoutUser)
AuthRouter.get("/getdata", protectuser,getUser)

export default AuthRouter