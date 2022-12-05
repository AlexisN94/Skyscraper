import FlightDataResponse from './api/flight-data-response';
import FlightPlan from './flight-plan';

type TicketModel = {
   nights: number;
   url: string;
   oneWay: boolean;
} & FlightPlan &
   Omit<FlightDataResponse, 'doingCaptcha' | 'noInternet'>;

export default TicketModel;
