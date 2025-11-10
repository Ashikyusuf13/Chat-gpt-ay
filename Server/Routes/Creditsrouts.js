import express from "express";
import { getplans, purchaseplan } from "../Controller/Credidcontroller.js";
import { protectuser } from "../Middleware/auth.js";

const creditrouter = express.Router();

creditrouter.get("/plan", getplans);
creditrouter.post("/purchase", protectuser, purchaseplan);

export default creditrouter;
