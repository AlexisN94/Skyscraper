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
      flightCategories: FlightCategory[],
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

         for (let flightCategory of flightCategories) {
            await this.parser.selectFlightCategory(page, flightCategory);
            [
               data[`${flightCategory}Flight`].price, // e.g. data.bestFlight.price
               data[`${flightCategory}Flight`].avgDuration,
               data[`${flightCategory}Flight`].outboundSegment,
               data[`${flightCategory}Flight`].inboundSegment,
            ] = await Promise.all([
               this.parser.getPrice(page, flightCategory),
               this.parser.getAvgDuration(page, flightCategory),
               this.parser.getSegmentDetails(page, SegmentDirection.outbound),
               this.parser.getSegmentDetails(page, SegmentDirection.inbound),
            ]);
         }

         onSuccess(data);
      } catch (e) {
         onError(e);
      }
      await this.terminate();
   }

   async waitForUserToSolveCaptcha(url: string) {
      try {
         const page = await this.browser.loadPage(url, true);
         await this.parser.startedCaptcha(page);
         await this.parser.completedCaptcha(page);
      } catch (e) {
         console.error(e);
      }
   }

   async terminate() {
      this.browser?.close();
   }
}

export default Scraper;
