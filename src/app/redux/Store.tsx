import { configureStore } from "@reduxjs/toolkit";
import modal from "./Modal";
import user from "./User";
import fontSize from "./FontSize";
import library from "./Library";
import finished from "./Finished";

export const saveStateToLocalStorage = (state: any) => {
  try {
    const user = state.user;
    if (user && user.uid) {
      const serializedState = JSON.stringify({
        library: state.library.savedBooks,
        finished: state.finished.finishedBooks,
      });
      localStorage.setItem(`reduxState_${user.uid}`, serializedState);
    }
  } catch (error) {
    console.error("Error saving state to localStorage:", error);
  }
};

const loadStateFromLocalStorage = () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || !user.uid) {
      console.warn("No valid user found in localStorage.");
      return undefined;
    }

    const serializedState = localStorage.getItem(`reduxState_${user.uid}`);
    if (serializedState) {
      const parsedState = JSON.parse(serializedState);
      return {
        library: { savedBooks: parsedState.library || {} },
        finished: { finishedBooks: parsedState.finished || {} },
      };
    }

    const savedBooks = JSON.parse(localStorage.getItem("savedBooks") || "{}");
    const finishedBooks = JSON.parse(
      localStorage.getItem("finishedBooks") || "{}"
    );

    return {
      library: { savedBooks },
      finished: { finishedBooks },
    };
  } catch (error) {
    console.error("Error loading state from localStorage:", error);
    return undefined;
  }
};

const preloadedState = loadStateFromLocalStorage();

const store = configureStore({
  reducer: {
    modal: modal,
    user: user,
    fontSize: fontSize,
    library: library,
    finished: finished,
  },
  preloadedState,
});

if (typeof window !== "undefined") {
  store.subscribe(() => {
    const state = store.getState();
    saveStateToLocalStorage(state);
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
