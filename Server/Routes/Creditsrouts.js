import express from "express";
import { getplans, purchaseplan, getUserPurchasedPlans } from "../Controller/Credidcontroller.js";
import { protectuser } from "../Middleware/auth.js";

const creditrouter = express.Router();

creditrouter.get("/plan", getplans);
creditrouter.get("/purchased", protectuser, getUserPurchasedPlans);
creditrouter.post("/purchase", protectuser, purchaseplan);

export default creditrouter;
