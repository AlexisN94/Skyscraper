import { Moment } from 'moment';

type DateRange = {
  departureDate: Moment;
  returnDate: Moment;
  nights: number;
};

export default DateRange;
