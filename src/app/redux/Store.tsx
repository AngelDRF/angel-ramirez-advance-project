import { configureStore } from "@reduxjs/toolkit";
import modal from "./Modal";
import user from "./User";
import fontSize from "./FontSize";

const store = configureStore({
  reducer: {
    modal: modal,
    user: user,
    fontSize: fontSize,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
