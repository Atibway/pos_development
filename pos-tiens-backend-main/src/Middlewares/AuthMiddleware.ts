require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import {
  customPayloadResponse,
  verifyAuthAccessToken,
} from "../Helpers/Helpers";

export const JWTAuthMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json(customPayloadResponse(false, "Token Expired"));
    }
    const decoded = verifyAuthAccessToken(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    req.user = decoded;
    next();
    return;
  } catch (error) {
    return res.status(401).json(customPayloadResponse(false, "Invalid Token"));
  }
};

