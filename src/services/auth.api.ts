import axios from "axios";
import { getSession, signIn } from "next-auth/react";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  try {
    const response = await axios.post("/api/auth/register", {
      name,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error("An error occurred while trying to register the user");
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!response?.ok) {
      throw new Error(response?.error || "Invalid email or password");
    }

    const session = await getSession();
    return session?.user ?? null;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw new Error("An error occurred while trying to log in the user");
  }
};
