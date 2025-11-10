import express from "express";
import { protectuser } from "../Middleware/auth.js";
import {
  imagemessagecontroller,
  textMessageController,
} from "../Controller/Messagecontroller.js";

const messagerouter = express.Router();

messagerouter.post("/text", protectuser, textMessageController);
messagerouter.post("/image", protectuser, imagemessagecontroller);

export default messagerouter;
