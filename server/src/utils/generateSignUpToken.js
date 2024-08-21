import jwt from "jsonwebtoken";

export const generateSignUpToken = (payload) => {
  const { email, password } = payload;
  //console.log(`email: ${email}, password: ${password}`);
  const token = jwt.sign({ email, password }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d", // Set to min later
  });
  console.log(`token: ${token}`);
  return token;
};
