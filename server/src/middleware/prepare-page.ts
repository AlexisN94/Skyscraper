import { Request, Response, NextFunction } from "express";
import Scraper from "../services/scraper";

const preparePage = async (req: Request, res: Response, next: NextFunction) => {
  const url = req.query.url as string;
  const scraper = res.locals.scraper;

  res.locals.page = await scraper.preparePage(
    url,
    () => onCaptcha(req, res),
    () => onError(res)
  );

  if (res.locals.page) next();
};

export default preparePage;

const onCaptcha = async (req: Request, res: Response) => {
  res.locals.scraper.terminate();
  res.status(200).json({ doingCaptcha: true });

  if (req.app.locals.doingCaptcha) return;
  req.app.locals.doingCaptcha = true;
  const headedScraper = new Scraper({
    parser: res.locals.scraperConfig.parser,
    headless: false,
  });
  await headedScraper.waitForUserToSolveCaptcha(req.query.url as string);
  await headedScraper.terminate();
  req.app.locals.doingCaptcha = false;
};

const onError = (res) => {
  res.status(500).json({ error: "Failed to prepare page" });
};
