import { Request, Response } from "express";
import ScrapedData from "../models/scraped-data";
import { Page } from "puppeteer";
import Scraper from "../services/scraper";

const getFlights = async (req: Request, res: Response) => {
  const scraper: Scraper = res.locals.scraper;
  const page: Page = res.locals.page;

  await scraper.getFlightDetails(page, onSuccess(res), onError(res));
};

export default getFlights;

const onSuccess = (res: Response) => (data: ScrapedData) => {
  res.status(200).json(data);
};

const onError = (res: Response) => (error: Error) => {
  console.error(error);
  res.status(500).json({ error: "Failed to get flight data" });
};
