import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

export const getSubscriptionStateFromDatabase = async (email: string) => {
  try {
    const customersSnapshot = await db
      .collection("customers")
      .where("email", "==", email)
      .get();

    if (customersSnapshot.empty) {
      return { isSubscribed: false, isPlusSubscribed: false };
    }

    const customerDoc = customersSnapshot.docs[0];
    const subscriptionsSnapshot = await customerDoc.ref.collection("subscriptions").get();

    let isSubscribed = false;
    let isPlusSubscribed = false;

    subscriptionsSnapshot.forEach((doc) => {
      const subscription = doc.data();
      if (subscription.status === "active") {
        const priceId = subscription.priceId;
        if (priceId === process.env.PRICE1_ID) {
          isPlusSubscribed = true;
        } else if (priceId === process.env.PRICE2_ID) {
          isSubscribed = true;
        }
      }
    });

    return { isSubscribed, isPlusSubscribed };
  } catch (error) {
    console.error("Error querying Firestore:", error);
    throw new Error("Failed to fetch subscription state from database");
  }
};

export { db };
