import { Moment } from 'moment';

type FlightPlan = {
   origin: string;
   destination: string;
   departureDate: Moment;
   returnDate?: Moment;
};

export default FlightPlan;
