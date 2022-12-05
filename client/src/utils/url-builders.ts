import FlightPlan from 'models/flight-plan';
import FlightSearchProvider from 'models/flight-search-provider';

export enum BaseURL {
   'skyscanner' = 'https://www.skyscanner.pt/transport/flights/',
}

export const buildURL = (
   { origin, destination, departureDate, returnDate }: FlightPlan,
   provider: FlightSearchProvider
): string => {
   let url = provider.baseURL;
   url += origin + '/';
   url += destination + '/';
   url += departureDate.format(provider.dateFormat) + '/';
   url += returnDate ? returnDate.format(provider.dateFormat) + '/' : '';
   return url;
};
