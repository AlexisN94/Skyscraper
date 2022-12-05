import FlightDataResponse from 'models/api/flight-data-response';
import FlightPlan from 'models/flight-plan';
import TicketModel from 'models/ticket-model';

export const makeTicket = (
   flightUrl: string,
   flightDataResponse: FlightDataResponse,
   flightPlan: FlightPlan,
   oneWay: boolean
): TicketModel => {
   return {
      ...flightPlan,
      ...flightDataResponse,
      oneWay,
      url: flightUrl,
      nights: !oneWay ? flightPlan.returnDate.diff(flightPlan.departureDate, 'd') : null,
   };
};
