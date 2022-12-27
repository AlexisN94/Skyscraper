import FlightCategory from 'constants/flight-category';
import TicketModel from 'models/ticket-model';

import { parseDuration } from './date';

export const enum SortOption {
   price = 'price_asc',
   departureDate = 'dept_date_asc',
   returnDate = 'ret_date_asc',
   stayDuration = 'nights_desc',
   avgFlightDuration = 'avg_duration_asc',
   stops = 'stops_asc',
   airlineCount = 'airline_count_asc',
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
            if (a.noFlights) {
               return 1;
            } else if (b.noFlights) {
               return -1;
            } else {
               return (flightA.price - flightB.price) * (sortAsc ? 1 : -1);
            }
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
      case SortOption.stops:
         return [...results].sort((a, b) => {
            const flightA = getFlightByCategory(a, activeFlightCategory);
            const flightB = getFlightByCategory(b, activeFlightCategory);
            if (a.noFlights) {
               return 1;
            } else if (b.noFlights) {
               return -1;
            } else {
               const flightA_stops =
                  flightA.inboundSegment.stops.length + flightA.outboundSegment.stops.length;
               const flightB_stops =
                  flightB.inboundSegment.stops.length + flightB.outboundSegment.stops.length;
               return (flightA_stops - flightB_stops) * (sortAsc ? 1 : -1);
            }
         });
      case SortOption.airlineCount:
         return [...results].sort((a, b) => {
            const flightA = getFlightByCategory(a, activeFlightCategory);
            const flightB = getFlightByCategory(b, activeFlightCategory);
            if (a.noFlights) {
               return 1;
            } else if (b.noFlights) {
               return -1;
            } else {
               const flightA_airlineCount =
                  flightA.inboundSegment.airlines.length + flightA.outboundSegment.airlines.length;
               const flightB_airlineCount =
                  flightB.inboundSegment.airlines.length + flightB.outboundSegment.airlines.length;
               return (flightA_airlineCount - flightB_airlineCount) * (sortAsc ? 1 : -1);
            }
         });
   }
};

export default sortResults;
