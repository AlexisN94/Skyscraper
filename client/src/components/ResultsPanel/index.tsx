import { CircularProgress, LinearProgress } from '@mui/material';
import FlightCategory from 'constants/flight-category';
import FlightSearchParams from 'models/flight-search-params';
import TicketModel from 'models/ticket-model';
import React, { FC, useEffect, useState } from 'react';
import { FaSortAmountDown, FaSortAmountDownAlt } from 'react-icons/fa';
import tailwindConfig from 'tailwind.config';
import sortResults, { SortOption } from 'utils/sort-results';

import ResultsList from 'components/ResultsList/index';
import AutoResizableSelect from 'components/ui/AutoResizableSelect';
import Toggle from 'components/ui/Toggle';

export type FlightResultsProps = {
   tickets: TicketModel[];
   loadedCount: number;
   totalResultsCount: number;
   searchParams: FlightSearchParams;
   searching: boolean;
   doingCaptcha: boolean;
};

const ResultsPanel: FC<FlightResultsProps> = ({
   tickets,
   loadedCount,
   totalResultsCount,
   searchParams,
   searching,
   doingCaptcha,
}) => {
   const [progress, setProgress] = useState(0);
   const [sortBy, setSortBy] = useState(SortOption.price);
   const [sortAsc, setSortAsc] = useState(true);
   const [sortedTickets, setSortedTickets] = useState(tickets);
   const [compactView, setCompactView] = useState(false);
   const [activeFlightCategory, setActiveFlightCategory] = useState(FlightCategory.cheapest);

   useEffect(() => {
      if (totalResultsCount === 0) return;
      const percentage = (100 * loadedCount) / totalResultsCount;
      setProgress(Number.parseFloat(percentage.toPrecision(2)));
   }, [loadedCount, totalResultsCount]);

   useEffect(() => {
      setSortedTickets(sortResults(tickets, sortBy, sortAsc, activeFlightCategory));
   }, [tickets, sortBy, sortAsc, activeFlightCategory]);

   return (
      <>
         <div className={`flex flex-col ${!searching && 'shadow-md'} z-10 bg-white`}>
            <div className="text-blue relative items-center px-6 py-5 flex justify-between font-bold text-sm">
               <div className={`flex items-start gap-7 text-[0.8rem]`}>
                  {searching && (
                     <div className="flex gap-1 items-center">
                        <CircularProgress size={17} thickness={7} />
                        {doingCaptcha ? (
                           <>Waiting for CAPTCHA...</>
                        ) : (
                           <>
                              Loading... {loadedCount}/{totalResultsCount}
                           </>
                        )}
                     </div>
                  )}
               </div>

               <div className="absolute whitespace-nowrap left-1/2 -translate-x-1/2">
                  <Toggle
                     options={['Normal', 'Compact']}
                     activeStyle={{
                        color: 'white',
                        backgroundColor: tailwindConfig.theme.extend.colors['blue'],
                     }}
                     inactiveStyle={{
                        color: tailwindConfig.theme.extend.colors['blue'],
                        backgroundColor: 'white',
                     }}
                     sharedStyle={{
                        padding: '0.6rem 0.9rem',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                     }}
                     onChange={(index) => {
                        setCompactView(index === 1);
                     }}
                     borderRadius={3.5}
                     border={`1.5px ${tailwindConfig.theme.extend.colors['blue']} solid`}
                  />
               </div>
               <div className="flex gap-4 text-[0.8rem] lg:flex-row lg:items-center flex-col items-end">
                  <label className="flex gap-1 items-center">
                     Category:
                     <AutoResizableSelect
                        onChange={(ev) =>
                           setActiveFlightCategory(ev.target.value as FlightCategory)
                        }
                        className="no-select-arrow border-blue outline-blue cursor-pointer 
                        hover:outline outline-[0.5px] p-0.5 border rounded-xl focus:outline-none px-1.5"
                     >
                        <option value={FlightCategory.cheapest}>Cheapest</option>
                        <option value={FlightCategory.best}>Best</option>
                        <option value={FlightCategory.fastest}>Fastest</option>
                     </AutoResizableSelect>
                  </label>
                  <div className="-mr-1 flex gap-2 items-center lg:mr-0">
                     <label className="flex gap-1 items-center">
                        Sort by:
                        <AutoResizableSelect
                           onChange={(ev) => setSortBy(ev.target.value as SortOption)}
                           className="no-select-arrow border-blue outline-blue cursor-pointer 
                        hover:outline outline-[0.5px] p-0.5 border rounded-xl focus:outline-none px-1.5"
                        >
                           <option value={SortOption.price}>Price</option>
                           {!searchParams.oneWay && (
                              <option value={SortOption.stayDuration}>Stay duration</option>
                           )}
                           <option value={SortOption.avgFlightDuration}>
                              Avg. flight duration
                           </option>
                           <option value={SortOption.departureDate}>Departure date</option>
                           {!searchParams.oneWay && (
                              <option value={SortOption.returnDate}>Return date</option>
                           )}
                           <option value={SortOption.stops}>Stops</option>
                        </AutoResizableSelect>
                     </label>
                     <button onClick={() => setSortAsc((state) => !state)}>
                        {sortAsc ? (
                           <FaSortAmountDownAlt size={20} />
                        ) : (
                           <FaSortAmountDown size={20} />
                        )}
                     </button>
                  </div>
               </div>
            </div>

            {progress < 100 && searching && (
               <LinearProgress
                  variant="determinate"
                  value={progress}
                  style={{ height: '5px', backgroundColor: '#D9D9D9' }}
               />
            )}
         </div>

         <ResultsList
            compact={compactView}
            tickets={sortedTickets}
            oneWay={searchParams.oneWay}
            activeFlightCategory={activeFlightCategory}
         />
      </>
   );
};

export default ResultsPanel;
