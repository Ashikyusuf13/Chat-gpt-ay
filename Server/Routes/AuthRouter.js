import express from "express";
import {
  getUser,
  loginUser,
  LogoutUser,
  register,
  userpublishedimages,
} from "../Controller/Usercontroller.js";
import { protectuser } from "../Middleware/auth.js";

const AuthRouter = express.Router();

AuthRouter.post("/register", register);
AuthRouter.post("/login", loginUser);
AuthRouter.post("/logout", LogoutUser);
AuthRouter.get("/getdata", protectuser, getUser);
AuthRouter.get("/published-images", userpublishedimages);

export default AuthRouter;
