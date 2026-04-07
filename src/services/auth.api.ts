import axios from "axios";

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
    const response = await axios.post("/api/auth/login", {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw new Error("An error occurred while trying to log in the user");
  }
};
