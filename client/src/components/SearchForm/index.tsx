import FlightCategory from 'constants/flight-category';
import useEnableDisable from 'hooks/use-enable-disable';
import { useQueryState } from 'hooks/use-query-state';
import { capitalize } from 'lodash';
import FlightSearchParams from 'models/flight-search-params';
import moment, { Moment } from 'moment';
import React, { FC, FormEvent, useEffect, useState } from 'react';
import { IoMdSwap } from 'react-icons/io';
import tailwindConfig from 'tailwind.config';
import { todayDate } from 'utils/date';
import { getURLQuery } from 'utils/url-query';

import FormField from 'components/FormField';
import RangeSlider from 'components/RangeSlider';
import rangeSliderStyle from 'components/RangeSlider/style';

import SearchButton from '../SearchButton';
import './style.css';
import EventEmitter from 'events';

export type Props = {
   searching: boolean;
   onSearch: (searchParams: FlightSearchParams) => void;
   onForceStop: () => void;
   eventEmitter: EventEmitter
   onPauseContinueToggle: (isPaused: boolean) => void;
};

const SearchForm: FC<Props> = ({ searching, onSearch, onForceStop, eventEmitter, onPauseContinueToggle }) => {
   const [oneWay, setOneWay] = useQueryState('oneWay', false);
   const [departWeekendsOnly, setDepartWeekendsOnly] = useQueryState('departWeekendsOnly', false);
   const [returnWeekendsOnly, setReturnWeekendsOnly] = useQueryState('returnWeekendsOnly', false);
   const [origin, setOrigin] = useQueryState('origin', '');
   const [destination, setDestination] = useQueryState('destination', '');
   const [minNights, setMinNights] = useQueryState('minNights', 0);
   const [maxNights, setMaxNights] = useQueryState('maxNights', 0);
   const [maxPossibleNights, setMaxPossibleNights] = useState<number>(null);
   const sliderHandler = useEnableDisable();
   const [departureDate, setDepartureDate] = useQueryState('departureDate', moment(), moment);
   const [returnDate, setReturnDate] = useQueryState<Moment>('returnDate', null, moment);
   const [flightCategories, setFlightCategories] = useQueryState<FlightCategory[]>(
      'flightCategories',
      [FlightCategory.best, FlightCategory.fastest, FlightCategory.cheapest]
   );
   const [paused, setPaused] = useState(false);

   const toggleRunningStatus = () => {
      setPaused(state => {
         onPauseContinueToggle(!state);
         return !state;
      });
   };

   useEffect(() => {
      eventEmitter.on("pause", () => setPaused(true));
      eventEmitter.on("continue", () => setPaused(false));
   }, []);

   useEffect(() => {
      if (oneWay) {
         sliderHandler.disable();
      } else {
         sliderHandler.enable();
      }
   }, [oneWay, sliderHandler]);

   useEffect(() => {
      if (oneWay) return;
      const departureMoment = moment(departureDate);
      const returnMoment = moment(returnDate);
      if (!departureMoment.isValid() || !returnMoment.isValid()) return;
      const totalNights = returnMoment.diff(departureMoment, 'd');
      if (totalNights < 0) {
         setReturnDate(departureDate);
         setMaxPossibleNights(0);
      } else {
         setMaxPossibleNights(totalNights);
      }
   }, [returnDate, departureDate]);

   useEffect(() => {
      if (maxPossibleNights === null) return;
      if (getURLQuery('maxNights') === null) {
         setMaxNights(maxPossibleNights);
      }
   }, [maxPossibleNights]);
   useEffect(() => {
      if (maxNights < minNights) setMaxNights(minNights);
   }, [minNights, maxNights]);

   const swapOriginAndDestination = () => {
      const _origin = origin;
      setOrigin(destination);
      setDestination(_origin);
   };

   const handleSubmit = (ev: FormEvent) => {
      ev.preventDefault();
      if (searching) {
         onForceStop();
      } else {
         onSearch({
            oneWay: oneWay,
            departWeekendsOnly,
            returnWeekendsOnly,
            origin,
            destination,
            departureDate: moment(departureDate),
            returnDate: moment(returnDate),
            minNights: minNights,
            maxNights: maxNights,
            flightCategories,
         });
      }
   };

   const onFlightCategoryChange = (flightCategory: FlightCategory) => {
      if (flightCategories.includes(flightCategory)) {
         setFlightCategories([...flightCategories].filter((it) => it !== flightCategory));
      } else {
         setFlightCategories([...flightCategories, flightCategory]);
      }
   };

   const tripTypes = [
      {
         label: 'Roundtrip',
         checked: !oneWay,
         onChange: () => setOneWay(false),
      },
      {
         label: 'One way',
         checked: oneWay,
         onChange: () => setOneWay(true),
      },
   ];

   return (
      <form
         className="bg-dark-blue p-6 pb-0.5 rounded-xl text-white font-bold flex flex-col gap-1 text-xs"
         onSubmit={handleSubmit}
      >
         <fieldset className="flex gap-4 text-[0.75rem]">
            {tripTypes.map(({ label, ...props }) => (
               <label key={label} className="flex items-center">
                  <input type="radio" name="trip-type" {...props} />
                  {label}
               </label>
            ))}
         </fieldset>

         <div className="my-4 flex w-full">
            <FormField
               label="From"
               type="text"
               className="flex flex-col text-sm gap-0.5 w-full"
               value={origin}
               minLength={3}
               maxLength={3}
               placeholder="Airport code"
               onChange={(ev) => setOrigin(ev.target.value.toUpperCase())}
               append={
                  <button
                     type="button"
                     tabIndex={-1}
                     className="mr-2"
                     onClick={swapOriginAndDestination}
                  >
                     <IoMdSwap color={tailwindConfig.theme.extend.colors['dark-blue']} size={28} />
                  </button>
               }
            />
            <FormField
               label="To"
               type="text"
               className="flex flex-col text-sm gap-0.5 w-full"
               minLength={3}
               maxLength={3}
               value={destination}
               placeholder="Airport code"
               onChange={(ev) => setDestination(ev.target.value.toUpperCase())}
            />
            <FormField
               label="Minimum departure date"
               type="date"
               className="flex flex-col text-sm gap-0.5 w-full"
               value={departureDate?.format('YYYY-MM-DD') || ''}
               min={todayDate}
               onChange={(ev) => setDepartureDate(moment(ev.target.value))}
               renderBelow={
                  <label className="text-xs flex items-center ml-2 mt-0.5 gap-1">
                     <input
                        type="checkbox"
                        checked={departWeekendsOnly}
                        onChange={(ev) => setDepartWeekendsOnly(ev.target.checked)}
                     />
                     Weekends only
                  </label>
               }
            />
            <FormField
               label={oneWay ? 'Maximum departure date' : 'Maximum return date'}
               type="date"
               className="flex flex-col text-sm gap-0.5 w-full"
               min={
                  departureDate
                     ? departureDate.format('YYYY-MM-DD')
                     : moment(todayDate).format('YYYY-MM-DD')
               }
               value={returnDate?.format('YYYY-MM-DD') || ''}
               onChange={(ev) => setReturnDate(moment(ev.target.value))}
               renderBelow={
                  <label className="text-xs flex items-center ml-2 mt-0.5 gap-1">
                     <input
                        type="checkbox"
                        checked={returnWeekendsOnly}
                        onChange={(ev) => setReturnWeekendsOnly(ev.target.checked)}
                     />
                     Weekends only
                  </label>
               }
            />
         </div>

         <div className={`flex w-full align-middle items-center h-full justify-between gap-5`}>
            <fieldset className="grid grid-cols-2 gap-x-2 gap-y-1 w-full max-w-[250px]">
               {Object.entries(FlightCategory).map((flightCategory) => (
                  <label key={flightCategory[1]} className="flex align-middle gap-1">
                     <input
                        type="checkbox"
                        checked={flightCategories.includes(flightCategory[1])}
                        onChange={(_) => onFlightCategoryChange(flightCategory[1])}
                     />
                     {capitalize(flightCategory[1])} flights
                  </label>
               ))}
            </fieldset>

            <RangeSlider
               title="Stay duration"
               showSubtitle={returnDate !== null}
               visible={sliderHandler.isEnabled}
               subtitle={
                  minNights === maxNights
                     ? `${minNights} night${minNights !== 1 && 's'}`
                     : `At least ${minNights} night${minNights !== 1 && 's'
                     }, at most ${maxNights} night${maxNights !== 1 && 's'}`
               }
               min={0}
               unit="night"
               max={maxPossibleNights}
               disabled={departureDate === null || returnDate === null}
               value={[minNights, maxNights]}
               onChange={(_, value) => {
                  setMinNights(value[0]);
                  setMaxNights(value[1]);
               }}
               disableSwap
               valueLabelDisplay="on"
               className="flex -translate-y-2 w-full"
               sx={rangeSliderStyle}
            />

            <div className='flex gap-4'>
               {searching &&
                  <button className='w-[60px]' type='button' onClick={_ => toggleRunningStatus()}>{paused ? "Continue" : "Pause"}</button>
               }
               <SearchButton
                  searching={searching}
                  type="submit"
                  className={`bg-blue text-base w-full justify-center lg:w-auto flex items-center py-2 h-fit px-8 whitespace-nowrap rounded-sm`}
               /></div>

         </div>

         <div className="-mt-0.5 text-xs italic tracking-tighter text-center font-medium text-gray-400">
            You may occasionally be prompted to complete CAPTCHAs
         </div>
      </form>
   );
};

export default SearchForm;
