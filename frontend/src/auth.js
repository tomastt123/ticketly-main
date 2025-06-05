import { jwtDecode } from "jwt-decode"; // Correct import for version 4.x

export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  console.log("Token in localStorage:", token); // Debugging token presence

  if (!token) {
    console.log("No token found.");
    return false;
  }

  try {
    const { exp } = jwtDecode(token); // Decode the token
    const currentTime = Math.floor(Date.now() / 1000);
    console.log("Token expiration time (UNIX):", exp);
    console.log("Current time (UNIX):", currentTime);
    console.log("Token at validation check:", token);


    if (currentTime >= exp) {
      console.log("Token expired.");
      localStorage.removeItem("token"); // Remove expired token
      return false;
    }

    console.log("Token is valid.");
    return true;
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token"); // Remove invalid token
    return false;
  }
};
