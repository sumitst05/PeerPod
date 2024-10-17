import axios from "axios";

export const signUp = async (credentials) => {
  try {
    const signUpResponse = await axios.post(`/api/auth/signup`, credentials);
    return {
      message: signUpResponse.data.message,
      success: signUpResponse.data.success,
    };
  } catch (error) {
    console.log("Error Signing up with Email: ", error);
    return {
      message:
        error.response?.data?.message || "Sign-up failed. Please try again.",
      success: false,
    };
  }
};

export const signIn = async (credentials) => {
  try {
    const loginResponse = await axios.post("/api/auth/signin", credentials);
    console.log(loginResponse.data);
    return {
      message: loginResponse.data.message,
      data: loginResponse.data.data,
      success: loginResponse.data.success,
    };
  } catch (error) {
    console.log("Error logging in with Email: ", error);
  }
};

export const signInWithGoogle = async (credentials) => {
  try {
    const loginResponse = await axios.post("/api/auth/google", credentials);
    return {
      message: loginResponse.data.message,
      data: loginResponse.data.data,
      success: loginResponse.data.success,
    };
  } catch (error) {
    console.log("Error with google login: ", error);
  }
};
