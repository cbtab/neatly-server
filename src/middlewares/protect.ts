import jwt from "jsonwebtoken";
import { Request, Response } from "express";

export const protect = async (req: Request, res: Response, next) => {
  const token = req.body.token;
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Token has invalid format",
    });
  }

  const tokenWithoutBearer = token.split(" ")[1];

  jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(401).json({
        message: "Token is invalid",
      });
    }
    //@ts-ignore
    req.user = payload;
    next();
  });
};
