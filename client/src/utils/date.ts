import DateRange from 'models/date-range';
import FlightSearchParams from 'models/flight-search-params';
import moment from 'moment';

export const isWeekendDay = (dayOfWeek: number) => dayOfWeek === 6 || dayOfWeek === 0;

export const getDateRanges = ({
   departureDate: startDate,
   returnDate: endDate,
   minNights,
   maxNights,
   oneWay,
   departWeekendsOnly,
   returnWeekendsOnly,
}: FlightSearchParams): DateRange[] => {
   const dateRanges: DateRange[] = [];

   if (oneWay) {
      for (let date = startDate; endDate.diff(date, 'd') >= 0; date.add(1, 'd')) {
         if (departWeekendsOnly && !isWeekendDay(date.day())) continue;
         dateRanges.push({
            departureDate: date.clone(),
            returnDate: undefined,
            nights: undefined,
         });
      }
   } else {
      const totalNights = endDate.diff(startDate, 'd');
      for (let numNights = minNights; numNights <= maxNights; numNights++) {
         const endOfRange = totalNights - numNights + 1;
         for (let startOfRange = 0; startOfRange < endOfRange; startOfRange++) {
            const departureDate = startDate.clone().add(startOfRange, 'd');
            const returnDate = departureDate.clone().add(numNights, 'd');
            if (departWeekendsOnly && !isWeekendDay(departureDate.day())) continue;
            if (returnWeekendsOnly && !isWeekendDay(returnDate.day())) continue;
            dateRanges.push({
               departureDate: departureDate,
               returnDate: returnDate,
               nights: numNights,
            });
         }
      }
   }
   return dateRanges;
};

export const parseDuration = (duration: string) => {
   const [h, m] = duration.split(' ').map((it) => Number.parseInt(it.slice(0, -1)));
   return moment.duration({ hours: h, minutes: m }).asMinutes();
};

export const todayDate = new Date().toISOString().split('T')[0];
