import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSubscriptionState = createAsyncThunk(
  "user/fetchSubscriptionState",
  async (email: string) => {
    try {
      const response = await fetch(`/api/getSubscriptionState?email=${email}`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch subscription state: ${response.statusText}`
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching subscription state:", error);
      throw error;
    }
  }
);
