// src/api/auth.ts
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firbase";

// Login admin using Firebase Authentication
export const loginAdmin = async (email: string, pin: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pin);
    return userCredential.user; // contains uid, email, etc.
  } catch (error: any) {
    console.error("Error logging in:", error);
    throw new Error(error.message);
  }
};
