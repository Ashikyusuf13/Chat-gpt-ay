import Stripe from "stripe";
import Transaction from "../Models/Transaction.js";
import User from "../Models/User.js";

export const stripewebhooks = async (request, response) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return response.status(400).send(`Webhook Error:${error.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const sessionList = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });
        const session = sessionList.data[0];
        const { transactionId, appId } = session.metadata;

        if (appId === "Aygpt") {
          const transaction = await Transaction.findOne({
            _id: transactionId,
            ispaid: false,
          });

          await User.updateOne(
            { _id: transaction.userId },
            { $inc: { credits: transaction.credits } }
          );

          //update payment
          transaction.ispaid = true;
          await transaction.save();
        } else {
          return response.json({
            received: true,
            message: "Ignore event : Inalid app",
          });
        }
        break;
      }

      default:
        console.log("unhandle event type", event.type);
        break;
    }

    response.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error.message);
    response.status(500).send("Internal server error");
  }
};
