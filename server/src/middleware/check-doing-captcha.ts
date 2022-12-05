import { Request, Response, NextFunction } from "express";

const checkDoingCaptcha = (req: Request, res: Response, next: NextFunction) => {
  if (req.app.locals.doingCaptcha) {
    res.status(200).json({ doingCaptcha: true });
  } else {
    next();
  }
};

export default checkDoingCaptcha;
