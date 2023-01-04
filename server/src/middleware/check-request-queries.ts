import { Request, Response, NextFunction } from "express";
import FlightCategory from "../enums/flight-category";
import SkyscannerParser from "../services/parsers/skyscanner-parser";
import Scraper from "../services/scraper";

const checkRequestQueries = (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.url || typeof req.query.url !== "string") {
    //TODO validate email
    res.status(400).json({
      error:
        "Invalid request. Example: " +
        "GET /flights?url=https://www.skyscanner.pt/transport/flights/opo/hkg/221130",
    });
    return;
  }

  const flightCategories = req.query.flightCategories 
    ? JSON.parse(req.query.flightCategories as string) as FlightCategory[] 
    : [FlightCategory.best, FlightCategory.cheapest, FlightCategory.fastest];

  res.locals.flightCategories = flightCategories;

  res.locals.scraperConfig = {
    parser: new SkyscannerParser(),
    headless: req.app.locals.headless,
  };

  res.locals.scraper = new Scraper(res.locals.scraperConfig);
  next();
};

export default checkRequestQueries;
