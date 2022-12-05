import moment from 'moment';
import { getDateRanges, isWeekendDay } from 'utils/date';

const range = (n: number) =>
   Array(n)
      .fill(0)
      .map((_, i) => i);

describe('getDateRanges', () => {
   test('should get range for one way', () => {
      const dateRange = getDateRanges({
         departureDate: moment(),
         returnDate: moment().add(4, 'd'),
         oneWay: true,
         origin: undefined,
         destination: undefined,
      }).map((range) => ({
         ...range,
         departureDate: range.departureDate.format('DD-MM-yyyy'),
      }));

      const expectedDateRange = range(5).map((d) => ({
         departureDate: moment().add(d, 'd').format('DD-MM-yyyy'),
         nights: undefined,
         returnDate: undefined,
      }));

      expect(dateRange).toEqual(expectedDateRange);
   });

   test('should only add weekends for one way', () => {
      const dateRange = getDateRanges({
         departureDate: moment(),
         returnDate: moment().add(4, 'd'),
         oneWay: true,
         origin: undefined,
         destination: undefined,
         departWeekendsOnly: true,
      }).map((range) => ({
         ...range,
         departureDate: range.departureDate.format('DD-MM-yyyy'),
      }));

      const expectedDateRange = range(5)
         .map((d) => {
            const date = moment().add(d, 'd');
            if (!isWeekendDay(date.day())) return null;

            return {
               departureDate: date.format('DD-MM-yyyy'),
               nights: undefined,
               returnDate: undefined,
            };
         })
         .filter((it) => it != null);

      expect(dateRange).toEqual(expectedDateRange);
   });

   test.todo('should get range for roundtrip');

   test.todo('should not exceeed return date for roundtrip');
});
