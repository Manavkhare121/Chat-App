import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";
export const authUser = async (req, res, next) => {
  try {
  const token =
    req.cookies.token ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized User - No token provided" });
  }

  console.log("🪪 Incoming token:", token);

  const isBlackListed = await redisClient.get(token);
  if (isBlackListed) {
    res.cookie("token", "");
    return res.status(401).json({ error: "Token blacklisted" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
} catch (error) {
  console.log("❌ Auth Error:", error.message);
  return res.status(401).json({ error: "Unauthorized User" });
}

};
