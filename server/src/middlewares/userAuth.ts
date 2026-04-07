import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const userAuth: RequestHandler = async (req: Request | any, res: Response, next: NextFunction) => {
  try {
    // Primary: Authorization header (works in ALL browsers cross-domain — Safari, Chrome, etc.)
    // Fallback: Cookie (for browsers that still support it)
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      token = req.cookies?.token;
    }

    if (!token) {
      throw new Error("Please Login");
    }

    const decodedMessage = jwt.verify(token, process.env.JWT_SECRET as string) as { _id: string };
    const { _id } = decodedMessage;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};
