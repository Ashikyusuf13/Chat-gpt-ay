import express from "express";
import cors from "cors";
import "dotenv/config";
import AuthRouter from "./Routes/AuthRouter.js";
import chatrouter from "./Routes/Chatrouter.js";
import messagerouter from "./Routes/MessageRoute.js";
import creditrouter from "./Routes/Creditsrouts.js";
import { stripewebhooks } from "./Controller/Webhooks.js";
import connectDb from "./Config/Db.js";

//initial express
const app = express();

//mongodb server
await connectDb();

//stripe webhook
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripewebhooks
);

//cors
const allowpages = ["http://localhost:5173"];

//middleware
app.use(cors({ origin: allowpages, credentials: true }));
app.use(express.json());

//routes
app.use("/api/auth", AuthRouter);
app.use("/api/chat", chatrouter);
app.use("/api/message", messagerouter);
app.use("/api/credit", creditrouter);

//homepage route
app.get("/", (req, res) => {
  res.send("Server is running sucessfully");
});

//listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("server is running on port:" + PORT);
});
