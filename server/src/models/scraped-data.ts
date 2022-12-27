import Flight from "./flight";

type ScrapedData = {
  noFlights: boolean;
  doingCaptcha?: boolean;
  noInternet?: boolean;
  error?: string;
  bestFlight?: Flight;
  cheapestFlight?: Flight;
  fastestFlight?: Flight;
};

export default ScrapedData;
