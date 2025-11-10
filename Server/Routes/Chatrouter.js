import express from "express"
import { createchats, deletechat, getchats } from "../Controller/Chatcontroller.js"
import { protectuser } from "../Middleware/auth.js"

const chatrouter = express.Router()

chatrouter.get("/create",protectuser,createchats)
chatrouter.get("/get",protectuser,getchats)
chatrouter.post("/delete",protectuser,deletechat)

export default chatrouter;