import { Page } from "puppeteer";
import ScrapedData from "../models/scraped-data";
import Browser from "./browser";
import ScraperConfig from "../models/scraper-config";
import Parser from "../interfaces/parser";
import FlightCategory from "../enums/flight-category";
import SegmentDirection from "../enums/segment-direction";

const getEmptyResultObject = (): ScrapedData => ({
  noFlights: false,
  bestFlight: {
    price: null,
    avgDuration: null,
    outboundSegment: null,
    inboundSegment: null,
  },
  cheapestFlight: {
    price: null,
    avgDuration: null,
    outboundSegment: null,
    inboundSegment: null,
  },
  fastestFlight: {
    price: null,
    avgDuration: null,
    outboundSegment: null,
    inboundSegment: null,
  },
});

class Scraper {
  private browser: Browser;
  private parser: Parser;

  constructor({ parser, headless }: ScraperConfig) {
    this.browser = new Browser({ headless: headless });
    this.parser = parser;
  }

  async preparePage(
    url: string,
    onCaptcha: () => Promise<boolean>,
    onError: (error: Error) => void
  ) {
    try {
      const page = await this.browser.loadPage(url);
      if (!(await this.parser.startedLoadingPricesWithoutCaptcha(page))) {
        if (onCaptcha) {
          onCaptcha();
          return null;
        }
      }
      await this.parser.finishedLoadingPrices(page);
      return page;
    } catch (e) {
      onError(e);
    }
  }

  async getFlightDetails(
    page: Page,
    onSuccess: (data: ScrapedData) => void,
    onError: (error: Error) => void
  ) {
    const data = getEmptyResultObject();
    try {
      if (!(await this.parser.hasFlights(page))) {
        data.noFlights = true;
        await this.terminate();
        onSuccess(data);
        return;
      }

      await this.parser.selectFlightCategory(page, FlightCategory.best);
      [
        data.bestFlight.price,
        data.bestFlight.avgDuration,
        data.bestFlight.outboundSegment,
        data.bestFlight.inboundSegment,
      ] = await Promise.all([
        this.parser.getPrice(page, FlightCategory.best),
        this.parser.getAvgDuration(page, FlightCategory.best),
        this.parser.getSegmentDetails(page, SegmentDirection.outbound),
        this.parser.getSegmentDetails(page, SegmentDirection.inbound),
      ]);

      await this.parser.selectFlightCategory(page, FlightCategory.cheapest);
      [
        data.cheapestFlight.price,
        data.cheapestFlight.avgDuration,
        data.cheapestFlight.outboundSegment,
        data.cheapestFlight.inboundSegment,
      ] = await Promise.all([
        this.parser.getPrice(page, FlightCategory.cheapest),
        this.parser.getAvgDuration(page, FlightCategory.cheapest),
        this.parser.getSegmentDetails(page, SegmentDirection.outbound),
        this.parser.getSegmentDetails(page, SegmentDirection.inbound),
      ]);

      await this.parser.selectFlightCategory(page, FlightCategory.fastest);
      [
        data.fastestFlight.price,
        data.fastestFlight.avgDuration,
        data.fastestFlight.outboundSegment,
        data.fastestFlight.inboundSegment,
      ] = await Promise.all([
        this.parser.getPrice(page, FlightCategory.fastest),
        this.parser.getAvgDuration(page, FlightCategory.fastest),
        this.parser.getSegmentDetails(page, SegmentDirection.outbound),
        this.parser.getSegmentDetails(page, SegmentDirection.inbound),
      ]);

      onSuccess(data);
      await this.terminate();
    } catch (e) {
      onError(e);
    }
  }

  async waitForUserToSolveCaptcha(url: string) {
    const page = await this.browser.loadPage(url);
    try {
      await this.parser.startedCaptcha(page);
      await this.parser.completedCaptcha(page);
    } catch (e) {
      console.error(e);
    }
  }

  async terminate() {
    this.browser.close();
  }
}

export default Scraper;
