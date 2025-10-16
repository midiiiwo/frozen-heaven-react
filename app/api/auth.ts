import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firbase";

export const loginAdmin = async (email: string, pin: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pin);
    return userCredential.user;
  } catch (error: any) {
    console.error("Error logging in:", error);
    throw new Error(error.message);
  }
};
