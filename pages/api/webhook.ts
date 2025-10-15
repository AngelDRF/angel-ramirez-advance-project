import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";
import { db } from "../../app/firebase/Admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const sig = req.headers["stripe-signature"] as string;

  let event;

  try {
    const rawBody = await buffer(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;

      const email = session.customer_email!;
      const subscriptionId = session.subscription as string;

      try {
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );
        console.log("Retrieved subscription:", subscription);

        const priceId = subscription.items.data[0]?.price.id;

        const customersSnapshot = await db
          .collection("customers")
          .where("email", "==", email)
          .get();

        let customerRef;

        if (customersSnapshot.empty) {
          customerRef = await db.collection("customers").add({
            email: email,
            stripeCustomerId: session.customer,
            stripeLink: `https://dashboard.stripe.com/customers/${session.customer}`,
          });
        } else {
          customerRef = customersSnapshot.docs[0].ref;
        }

        try {
          await customerRef
            .collection("subscriptions")
            .doc(subscriptionId)
            .set({
              status: subscription.status,
              priceId: priceId,
              items: subscription.items.data.map((item) => ({
                price: item.price.id,
                quantity: item.quantity,
              })),
            });
        } catch (error) {
          console.error("Error writing subscription to Firestore:", error);
        }
      } catch (error) {
        console.error(
          "Error updating Firestore with subscription details:",
          error
        );
        return res
          .status(500)
          .json({ error: "Failed to retrieve subscription" });
      }

      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
}
