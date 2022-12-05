import { Request, Response, NextFunction } from "express";
import SkyscannerParser from "../services/parsers/skyscanner-parser";
import Scraper from "../services/scraper";

const checkFlightUrl = (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.url || typeof req.query.url !== "string") {
    //TODO validate email
    res.status(400).json({
      error:
        "Invalid request. Example: " +
        "GET /flights?url=https://www.skyscanner.pt/transport/flights/opo/hkg/221130",
    });
    return;
  }

  res.locals.scraperConfig = {
    parser: new SkyscannerParser(),
    headless: req.app.locals.headless,
  };

  res.locals.scraper = new Scraper(res.locals.scraperConfig);
  next();
};

export default checkFlightUrl;
