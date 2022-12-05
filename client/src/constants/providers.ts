import FlightSearchProvider from 'models/flight-search-provider';
import AssertRecordType from 'utils/assert-record-type';

import DateFormat from './date-format';

const Providers = AssertRecordType<FlightSearchProvider>()({
   skyscanner: {
      baseURL: 'https://www.skyscanner.pt/transport/flights/',
      dateFormat: DateFormat.skyscanner,
   },
});

export default Providers;
