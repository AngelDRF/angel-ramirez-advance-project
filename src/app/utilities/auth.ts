import { auth } from "../firebase/config";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInAnonymously,
  signOut,
} from "firebase/auth";
import { AppDispatch } from "../redux/Store";
import {
  setSummaristLogin,
  setGoogleLogin,
  setGuestLogin,
  setLoggedOut,
} from "../redux/User";
import { loadSavedBooks, clearSavedBooks } from "../redux/Library";
import { clearFinishedBooks } from "../redux/Finished";
import store from "../redux/Store";
import { saveStateToLocalStorage } from "../redux/Store";

const provider = new GoogleAuthProvider();

const serializeUser = (user: User) => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
});

const saveUserToLocalStorage = (user: any, loginType: string) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("loginType", loginType);
};

const removeUserFromLocalStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("loginType");
};

const loadUserFromLocalStorage = (): any | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const googleLogin = async (
  dispatch: AppDispatch
): Promise<{
  token: string | null;
  user: User;
} | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential) {
      const token = credential.accessToken ?? null;
      const user = result.user;
      const serializedUser = serializeUser(user);
      saveUserToLocalStorage(serializedUser, "google");
      dispatch(setGoogleLogin(serializedUser));
      dispatch(loadSavedBooks({ userId: serializedUser.uid }));
      return { token, user };
    } else {
      console.error("No credential found in the result.");
      return null;
    }
  } catch (error: any) {
    console.error("Error during Google login:", error);
    throw error;
  }
};

export const summaristRegister = async (
  email: string,
  password: string,
  dispatch: AppDispatch
): Promise<User | null> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const serializedUser = serializeUser(user);
    saveUserToLocalStorage(serializedUser, "summarist");
    dispatch(setSummaristLogin(serializedUser));
    dispatch(loadSavedBooks({ userId: serializedUser.uid }));
    return user;
  } catch (error: any) {
    console.error("Error during registration:", error);
    throw error;
  }
};

export const summaristLogin = async (
  email: string,
  password: string,
  dispatch: AppDispatch
): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const serializedUser = serializeUser(user);
    saveUserToLocalStorage(serializedUser, "summarist");
    dispatch(setSummaristLogin(serializedUser));
    dispatch(loadSavedBooks({ userId: serializedUser.uid }));
    return user;
  } catch (error: any) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const guestLogin = async (
  dispatch: AppDispatch
): Promise<User | null> => {
  try {
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;
    const serializedUser = serializeUser(user);
    saveUserToLocalStorage(serializedUser, "guest");
    dispatch(setGuestLogin(serializedUser));
    return user;
  } catch (error: any) {
    console.error("Error during guest login:", error);
    throw error;
  }
};

export const logoutUser = async (dispatch: AppDispatch): Promise<void> => {
  try {
    saveStateToLocalStorage(store.getState());

    await signOut(auth);

    removeUserFromLocalStorage();

    dispatch(clearSavedBooks());
    dispatch(clearFinishedBooks());
    dispatch(setLoggedOut());

    console.log("User signed out successfully.");
  } catch (error: any) {
    console.error("Error during logout:", error);
    throw error;
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent successfully.");
  } catch (error: any) {
    console.error("Error during password reset:", error);
    throw error;
  }
};
