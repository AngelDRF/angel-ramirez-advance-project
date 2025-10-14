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
      console.log("Token:", token);
      console.log("User:", serializedUser);
      dispatch(setGoogleLogin(serializedUser));
      return { token, user };
    } else {
      console.error("No credential found in the result.");
      return null;
    }
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData?.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.error("Error Code:", errorCode);
    console.error("Error Message:", errorMessage);
    console.error("Email:", email);
    console.error("Credential Error:", credential);
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
    console.log("User registered successfully:", serializedUser);
    dispatch(setSummaristLogin(serializedUser));
    return user;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error Code:", errorCode);
    console.error("Error Message:", errorMessage);
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
    console.log("User logged in successfully:", serializedUser);
    dispatch(setSummaristLogin(serializedUser));

    saveUserToLocalStorage(serializedUser, "summarist");
    return user;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error Code:", errorCode);
    console.error("Error Message:", errorMessage);
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
    console.log("Guest signed in successfully:", serializedUser);

    saveUserToLocalStorage(serializedUser, "guest");
    dispatch(setGuestLogin(serializedUser));
    return user;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error Code:", errorCode);
    console.error("Error Message:", errorMessage);
    throw error;
  }
};

export const logoutUser = async (dispatch: AppDispatch): Promise<void> => {
  try {
    await signOut(auth);

    removeUserFromLocalStorage();
    console.log("User signed out successfully.");
    dispatch(setLoggedOut());
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error Code:", errorCode);
    console.error("Error Message:", errorMessage);
    throw error;
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent successfully.");
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error Code:", errorCode);
    console.error("Error Message:", errorMessage);
    throw error;
  }
};
