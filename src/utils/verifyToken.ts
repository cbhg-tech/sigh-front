import * as jwt from "jsonwebtoken";

export const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET || "secret";

  return jwt.verify(token, secret);
};
