import FlightCategory from 'constants/flight-category';
import TicketModel from 'models/ticket-model';

import { parseDuration } from './date';

export const enum SortOption {
   price = 'price_asc',
   departureDate = 'dept_date_asc',
   returnDate = 'ret_date_asc',
   stayDuration = 'nights_desc',
   avgFlightDuration = 'avg_duration_asc',
}

const getFlightByCategory = (ticketModel: TicketModel, activeCategory: FlightCategory) => {
   switch (activeCategory) {
      case FlightCategory.best:
         return ticketModel.bestFlight;
      case FlightCategory.cheapest:
         return ticketModel.cheapestFlight;
      case FlightCategory.fastest:
         return ticketModel.fastestFlight;
   }
};

const sortResults = (
   results: TicketModel[],
   sortBy: SortOption,
   sortAsc: boolean,
   activeFlightCategory: FlightCategory
) => {
   switch (sortBy) {
      case SortOption.price:
         return [...results].sort((a, b) => {
            const flightA = getFlightByCategory(a, activeFlightCategory);
            const flightB = getFlightByCategory(b, activeFlightCategory);
            return (flightA.price - flightB.price) * (sortAsc ? 1 : -1);
         });
      case SortOption.departureDate:
         return [...results].sort(
            (a, b) => a.departureDate.diff(b.departureDate, 'd') * (sortAsc ? 1 : -1)
         );
      case SortOption.returnDate:
         return [...results].sort(
            (a, b) => a.returnDate.diff(b.returnDate, 'd') * (sortAsc ? 1 : -1)
         );
      case SortOption.stayDuration:
         return [...results].sort((a, b) => (a.nights - b.nights) * (sortAsc ? 1 : -1));
      case SortOption.avgFlightDuration:
         return [...results].sort((a, b) => {
            const flightA = getFlightByCategory(a, activeFlightCategory);
            const flightB = getFlightByCategory(b, activeFlightCategory);
            if (a.noFlights) {
               return 1;
            } else if (b.noFlights) {
               return -1;
            } else {
               return (
                  (parseDuration(flightA.avgDuration) - parseDuration(flightB.avgDuration)) *
                  (sortAsc ? 1 : -1)
               );
            }
         });
   }
};

export default sortResults;
