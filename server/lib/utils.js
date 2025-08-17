// Importing the 'jsonwebtoken' library which allows us to create and verify JWTs (JSON Web Tokens).
import jwt from "jsonwebtoken";

// Function to generate a token for a user
// 'userId' is the unique identifier of the user, passed to this function.
export const generateToken = (userId) => {
  // Create a token using jwt.sign() method.
  // jwt.sign(payload, secretKey)
  // payload → the data we want to store inside the token (here, userId).
  // process.env.JWT_SECRET → the secret key used to digitally sign the token (stored securely in environment variables).
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);

  // Return the generated token so it can be sent to the client (for authentication).
  return token;
};
