import { Page } from "puppeteer";
import FlightCategory from "../enums/flight-category";
import SegmentDirection from "../enums/segment-direction";
import FlightSegment from "../models/flight-segment";

export interface Parser {
  getPrice: (page: Page, flightCategory: FlightCategory) => Promise<any>;
  getAvgDuration: (
    page: Page,
    flightCategory: FlightCategory
  ) => Promise<string>;
  selectFlightCategory: (
    page: Page,
    flightCategory: FlightCategory
  ) => Promise<any>;
  getSegmentDetails: (
    page: Page,
    segmentDirection: SegmentDirection
  ) => Promise<FlightSegment>;
  hasFlights: (page: Page) => Promise<any>;
  startedLoadingPricesWithoutCaptcha: (page: Page) => Promise<any>;
  startedCaptcha: (page: Page) => Promise<any>;
  completedCaptcha: (page: Page) => Promise<any>;
  startedLoadingPrices: (page: Page) => Promise<any>;
  finishedLoadingPrices: (page: Page) => Promise<any>;
}

export default Parser;
