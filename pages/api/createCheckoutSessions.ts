import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

interface CheckoutSessionRequestBody {
  lookupKey: string;
  email: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { lookupKey, email } = req.body as CheckoutSessionRequestBody;

    if (!lookupKey || !email) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    try {
      const priceId =
        lookupKey === "premium plus annual"
          ? process.env.PRICE1_ID
          : process.env.PRICE2_ID;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: email,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.headers.origin}/for-youPage?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/choose-planPage`,
      });

      res.status(200).json({ sessionId: session.id });
    } catch (err: any) {
      console.error("Error creating Stripe Checkout session:", err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
