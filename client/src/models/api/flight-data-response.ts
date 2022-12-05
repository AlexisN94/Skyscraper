import Flight from './flight';

type FlightDataResponse = {
   noFlights: boolean;
   doingCaptcha?: boolean;
   noInternet?: boolean;
   bestFlight?: Flight;
   cheapestFlight?: Flight;
   fastestFlight?: Flight;
};

export default FlightDataResponse;
