import Parser from "../interfaces/parser";

export type ScraperConfig = {
  parser: Parser;
  headless: boolean;
};

export default ScraperConfig;
