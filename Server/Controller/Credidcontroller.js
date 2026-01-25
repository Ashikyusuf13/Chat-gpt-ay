import Stripe from "stripe";
import Transaction from "../Models/Transaction.js";

const plans = [
  {
    _id: "basic",
    name: "Basic",
    price: 10,
    credits: 100,
    features: [
      "100 text generations",
      "50 image generations",
      "Standard support",
      "Access to basic models",
    ],
  },
  {
    _id: "pro",
    name: "Pro",
    price: 20,
    credits: 500,
    features: [
      "500 text generations",
      "200 image generations",
      "Priority support",
      "Access to pro models",
      "Faster response time",
    ],
  },
  {
    _id: "premium",
    name: "Premium",
    price: 1000,
    credits: 1000,
    features: [
      "1000 text generations",
      "500 image generations",
      "24/7 VIP support",
      "Access to premium models",
      "Dedicated account manager",
    ],
  },
];

//Api controller for get all plans
export const getplans = async (req, res) => {
  try {
    res.json({ success: true, plans });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Get user's purchased plans
export const getUserPurchasedPlans = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all successful (paid) transactions for this user
    const purchasedTransactions = await Transaction.find({
      userId: userId,
      ispaid: true,
    });

    // Get unique plan IDs that the user has purchased
    const purchasedPlanIds = [...new Set(purchasedTransactions.map(t => t.planId))];

    res.json({
      success: true,
      purchasedPlanIds,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//purchase the new plan
export const purchaseplan = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id;
    const plan = plans.find((plan) => plan._id === planId);

    if (!plan) {
      return res.json({ success: false, message: "Invalid plan" });
    }

    const transactions = await Transaction.create({
      userId: userId,
      planId: plan._id,
      amount: plan.price,
      credits: plan.credits,
      ispaid: false,
    });

    const { origin } = req.headers;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: plan.price * 100,
            product_data: {
              name: plan.name,
              description: `${plan.credits} credits`,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/loading`,
      cancel_url: `${origin}`,
      metadata: {
        transactionId: transactions._id.toString(),
        appId: "Aygpt",
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    // Add response with checkout session URL
    res.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
