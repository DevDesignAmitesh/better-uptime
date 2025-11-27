import { NextFunction, Request, Response } from "express";
import { verifyToken } from "./utils";

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "un-authorized" });
    }

    const decoded = verifyToken({ token });

    console.log("this decoded", decoded);
    console.log("this decoded", typeof decoded);

    if (!decoded) {
      return res.status(401).json({ message: "un-authorized" });
    }

    console.log("this decoded", decoded);
    console.log("this decoded", typeof decoded);

    req.user = { userId: decoded };

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "un-authorized" });
  }
};
