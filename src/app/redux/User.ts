import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserTypes } from "../UserTypes";

interface UserState {
  user: UserTypes | null;
  isLoggedIn: boolean;
  isSummaristLoggedIn: boolean;
  isGoogleLoggedIn: boolean;
  isGuestLoggedIn: boolean;
  isSubscribed: boolean;
  isPlusSubscribed: boolean;
}

const initialState: UserState = {
  user: null,
  isLoggedIn: false,
  isSummaristLoggedIn: false,
  isGoogleLoggedIn: false,
  isGuestLoggedIn: false,
  isSubscribed: false,
  isPlusSubscribed: false,
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSummaristLogin: (state, action: PayloadAction<UserTypes>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isSummaristLoggedIn = true;
      state.isGoogleLoggedIn = false;
      state.isGuestLoggedIn = false;
      state.isSubscribed = false;
      state.isPlusSubscribed = false;
    },

    setGoogleLogin: (state, action: PayloadAction<UserTypes>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isSummaristLoggedIn = false;
      state.isGoogleLoggedIn = true;
      state.isGuestLoggedIn = false;
      state.isSubscribed = false;
      state.isPlusSubscribed = false;
    },

    setGuestLogin: (state, action: PayloadAction<UserTypes>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isSummaristLoggedIn = false;
      state.isGoogleLoggedIn = false;
      state.isGuestLoggedIn = true;
      state.isSubscribed = false;
      state.isPlusSubscribed = false;
    },

    setLoggedOut: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.isSummaristLoggedIn = false;
      state.isGoogleLoggedIn = false;
      state.isGuestLoggedIn = false;
      state.isSubscribed = false;
      state.isPlusSubscribed = false;
    },

    setSubscribed: (state, action: PayloadAction<boolean>) => {
      state.isSubscribed = action.payload;
    },

    setPlusSubscribed: (state, action: PayloadAction<boolean>) => {
      state.isPlusSubscribed = action.payload;
    },
  },
});

export const {
  setSummaristLogin,
  setGoogleLogin,
  setGuestLogin,
  setLoggedOut,
  setSubscribed,
  setPlusSubscribed,
} = user.actions;

export default user.reducer;
