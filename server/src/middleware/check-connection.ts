import { Request, Response, NextFunction } from "express";
import checkConnectionStatus from "../utils/check-connection-status";

const checkConnection = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (!(await checkConnectionStatus())) {
    res.status(503).json({ noInternet: true });
  } else {
    next();
  }
};

export default checkConnection;
