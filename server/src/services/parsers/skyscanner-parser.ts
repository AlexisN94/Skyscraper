import { Page } from "puppeteer";
import FlightCategory from "../../enums/flight-category";
import SegmentDirection from "../../enums/segment-direction";
import Parser from "../../interfaces/parser";
import FlightSegment from "../../models/flight-segment";

class SkyscannerParser implements Parser {
  private CAPTCHA_TIME = -1;
  private selectors = {
    promotedTicket: ".ItineraryInlinePlusWrapper_ticketContainer__ZmE3Z",
    price: ".Price_mainPriceContainer__MDM3O",
    noFlights: ".FallbackNoResults_container__OTliZ",
    captcha: '//*[contains(text(), "Are you a person or a robot")]',
    loadingPrices:
      ".BpkProgress_bpk-progress__ODdlN.BpkProgress_bpk-progress--small__MWU5N",
    searchStarted: ".ResultsSummary_container__ZWE4O",
    connectionDuration: ".Connection_duration__YmQzZ",
    outboundFlightSegment:
      ".LegDetails_container__MTkyZ.UpperTicketBody_leg__MmNkN:nth-child(1)",
    inboundFlightSegment:
      ".LegDetails_container__MTkyZ.UpperTicketBody_leg__MmNkN:nth-child(2)",
    departureTime:
      ".LegInfo_routePartialDepart__NzEwY .LegInfo_routePartialTime__OTFkN > div > span",
    arrivalTime:
      ".LegInfo_routePartialArrive__Y2U1N .LegInfo_routePartialTime__OTFkN > div > span",
    origin: ".LegInfo_routePartialDepart__NzEwY > span:nth-child(2) > div",
    destination: ".LegInfo_routePartialArrive__Y2U1N > span:nth-child(2) > div",
    flightDuration: ".Duration_duration__NmUyM",
    stops: ".LegInfo_stopsRow__MTUwZ",
    airlines: ".LogoImage_container__MDU0Z",
    airlineAlt: ".BpkImage_bpk-image__img__OTRhN",
    timeOffset: ".TimeWithOffsetTooltip_offsetTooltipContainer__NjA0M",
    flightCategoryButton: {
      best: ".FqsTabs_tooltipTargetContainer__YjU5N:nth-child(1) > button",
      cheapest: ".FqsTabs_tooltipTargetContainer__YjU5N:nth-child(2) > button",
      fastest: ".FqsTabs_tooltipTargetContainer__YjU5N:nth-child(3) > button",
    },
    avgDuration: {
      best: ".FqsTabs_tooltipTargetContainer__YjU5N:nth-child(1) > button > :nth-child(3)",
      cheapest:
        ".FqsTabs_tooltipTargetContainer__YjU5N:nth-child(2) > button > :nth-child(3)",
      fastest:
        ".FqsTabs_tooltipTargetContainer__YjU5N:nth-child(3) > button > :nth-child(3)",
    },
  };
  getPrice = async (
    page: Page,
    flightCategory: FlightCategory
  ): Promise<number> => {
    const flightCategoryIndex = (() => {
      switch (flightCategory) {
        case FlightCategory.best:
          return 0;
        case FlightCategory.cheapest:
          return 1;
        case FlightCategory.fastest:
          return 2;
      }
    })();

    const price = await (
      await page.$$(this.selectors.price)
    )[flightCategoryIndex].evaluate((el) =>
      el.textContent.replace(String.fromCharCode(160), "").slice(0, -1)
    );
    return Number.parseInt(price);
  };

  getAvgDuration = async (
    page: Page,
    flightCategory: FlightCategory
  ): Promise<string> => {
    const avgDuration = await (
      await page.$(this.selectors.avgDuration[flightCategory])
    ).evaluate((el) => el?.textContent.split(" (")[0]);
    return avgDuration;
  };

  hasFlights = async (page: Page): Promise<boolean> => {
    return (await page.$(this.selectors.noFlights)) == null;
  };

  selectFlightCategory = async (
    page: Page,
    flightCategory: FlightCategory
  ): Promise<any> => {
    await page.evaluate((categorySelector) => {
      const categoryBtn = document.querySelector(categorySelector);
      if (categoryBtn) {
        (categoryBtn as HTMLButtonElement).click()
      } else {
        throw ("Failed to find elemenent with query: \"" + categorySelector + "\"")
      }
    }, this.selectors.flightCategoryButton[flightCategory]);
  };

  getSegmentDetails = async (
    page: Page,
    segmentDirection: SegmentDirection
  ): Promise<FlightSegment> => {
    const segmentSelector =
      segmentDirection === SegmentDirection.inbound
        ? this.selectors.inboundFlightSegment
        : this.selectors.outboundFlightSegment;

    const ticketIndex = (await this.hasPromotedTicket(page)) ? 1 : 0;
    const segment = (await page.$$(segmentSelector))[ticketIndex];
    if (!segment) return undefined;

    const duration = await segment.$eval(
      this.selectors.flightDuration,
      (el) => el?.textContent
    );

    const origin = await segment.$eval(
      this.selectors.origin,
      (el) => el?.textContent
    );

    const destination = await segment.$eval(
      this.selectors.destination,
      (el) => el?.textContent
    );

    const departureTime = await segment.$eval(
      this.selectors.departureTime,
      (el) => el?.textContent
    );

    const arrivalTime = await segment.$eval(
      this.selectors.arrivalTime,
      (el) => el?.textContent
    );

    const stops = await segment.$eval(this.selectors.stops, (el) =>
      el?.textContent.split(", ").filter((el) => el.length > 0)
    );

    let airlines = await segment.$eval(this.selectors.airlines, (el) =>
      el?.textContent.split(" + ").filter((el) => el.length > 0)
    );

    if (airlines.length === 0) {
      airlines = [
        await segment.$eval(this.selectors.airlineAlt, (el) =>
          el?.getAttribute("alt")
        ),
      ];
    }

    const timeOffset = await (
      await segment.$(this.selectors.timeOffset)
    )?.evaluate((el) => el.textContent);

    return {
      origin,
      destination,
      duration,
      departureTime,
      arrivalTime,
      stops,
      airlines,
      timeOffset,
    };
  };

  startedCaptcha = async (page: Page): Promise<Number> => {
    if ((await page.waitForXPath(this.selectors.captcha)) !== null) {
      return this.CAPTCHA_TIME;
    } else {
      return Promise.reject();
    }
  };

  startedLoadingPricesWithoutCaptcha = async (page: Page): Promise<boolean> => {
    return (
      (await Promise.any([
        this.startedCaptcha(page),
        this.startedLoadingPrices(page),
      ])) != this.CAPTCHA_TIME
    );
  };

  completedCaptcha = async (page: Page): Promise<any> => {
    return await page.waitForXPath(this.selectors.captcha, {
      hidden: true,
      timeout: 0,
    });
  };

  startedLoadingPrices = async (page: Page): Promise<any> => {
    return page.waitForSelector(this.selectors.searchStarted);
  };

  finishedLoadingPrices = async (page: Page): Promise<any> => {
    return page.waitForSelector(this.selectors.loadingPrices, {
      hidden: true,
      timeout: 0,
    });
  };

  hasPromotedTicket = async (page: Page): Promise<any> => {
    return (await page.$(this.selectors.promotedTicket)) !== null;
  };
}

export default SkyscannerParser;
