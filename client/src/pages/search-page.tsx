import config from 'constants/config';
import Providers from 'constants/providers';
import _ from 'lodash';
import FlightDataResponse from 'models/api/flight-data-response';
import DateRange from 'models/date-range';
import FlightPlan from 'models/flight-plan';
import FlightSearchParams from 'models/flight-search-params';
import TicketModel from 'models/ticket-model';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getDateRanges } from 'utils/date';
import { makeTicket } from 'utils/make-ticket';
import { buildURL as buildUrl } from 'utils/url-builders';
import webWorker from 'utils/web-worker';
import { WorkerPool } from 'utils/worker-pool';

import SearchResults from 'components/ResultsPanel/index';
import SearchForm from 'components/SearchForm/index';
import FlightCategory from 'constants/flight-category';
import EventEmitter from 'events';
import { notification } from 'antd';

const SearchPage = () => {
   const [workerPool, setWorkerPool] = useState<WorkerPool<TicketModel>>(null);
   const [searchResults, setSearchResults] = useState<TicketModel[]>([]);
   const [maxResultsCount, setMaxResultsCount] = useState(0);
   const [loadedCount, setLoadedCount] = useState(0);
   const audioPlayer = useRef<HTMLAudioElement>(null);
   const [searchParams, setSearchParams] = useState<FlightSearchParams>();
   const [searching, setSearching] = useState(false);
   const [doingCaptcha, setDoingCaptcha] = useState(false);
   const [enabledFlightCategories, setEnabledFlightCategories] = useState<FlightCategory[]>([]);
   const eventEmitter = useRef(new EventEmitter);
   const [paused, setPaused] = useState(false);

   const playAudio = (pathToFile: string) => {
      audioPlayer.current.src = pathToFile;
      audioPlayer.current.play();
   };

   const debouncePlayAudio = useCallback(
      _.throttle((audioFile) => playAudio(audioFile), 1000, { trailing: false }),
      []
   );

   useEffect(() => {
      setWorkerPool(new WorkerPool<FlightDataResponse>(config.workerPool.size, webWorker));
   }, []);

   useEffect(() => {
      if (workerPool) workerPool.onCompleted = handleSearchEnd;
   }, [workerPool]);

   useEffect(() => {
      if (doingCaptcha) playAudio(config.audioSrc.warning);
   }, [doingCaptcha]);

   const openNotification = useCallback(
      _.throttle((message, description = undefined) =>
         notification.open({ message, description, placement: 'bottomRight' })
         , 5000,
         { trailing: false }),
      []);

   const handleSearch = (searchParams: FlightSearchParams) => {
      const dateRanges = getDateRanges(searchParams);

      setSearchParams(searchParams);
      setSearching(true);
      setSearchResults([]);
      setLoadedCount(0);
      setMaxResultsCount(dateRanges.length);
      setDoingCaptcha(false);
      setEnabledFlightCategories(searchParams.flightCategories);

      dateRanges.forEach((dateRange: DateRange) => {
         const flightPlan: FlightPlan = {
            origin: searchParams.origin,
            destination: searchParams.destination,
            departureDate: dateRange.departureDate,
            returnDate: dateRange.returnDate,
         };

         const flightUrl = buildUrl(flightPlan, Providers.skyscanner);
         if (!flightUrl) {
            handleSearchEnd("Couldn't build URL");
            return;
         }

         workerPool.enqueue({
            args: [flightUrl, config.backendURL, searchParams.flightCategories],
            onmessage: (flightDataResponse: FlightDataResponse, releaseWorker: () => void) => {
               if (flightDataResponse.doingCaptcha) {
                  if (!doingCaptcha) setDoingCaptcha(true);
                  return;
               }
               if (flightDataResponse.noInternet) {
                  handleSearchEnd(config.errorMessages.api.noConnection);
                  return;
               }
               setDoingCaptcha(false);
               setLoadedCount((state) => state + 1);
               setSearchResults((state) => [
                  ...state,
                  makeTicket(flightUrl, flightDataResponse, flightPlan, searchParams.oneWay),
               ]);
               releaseWorker();
            },
            onerror: (error: ErrorEvent) => {
               debouncePlayAudio(config.audioSrc.error);
               workerPool.pause();
               eventEmitter.current.emit("pause");
               if (searchResults.length > 0) setPaused(true);
               else handleSearchEnd();
               console.log(error);
               openNotification("Search failed", error.message.replace("Uncaught Error: ", ""));
            },
         });
      });

      workerPool.start();
   };

   const handleSearchCancel = () => {
      handleSearchEnd();
   };

   const handleSearchEnd = (errorMessage?: string) => {
      setSearching(false);
      workerPool.immediatelyStopAndReset();
      let audio = config.audioSrc.success;
      if (errorMessage) {
         audio = config.audioSrc.error;
         console.log(errorMessage);
      } else {
         openNotification("Search complete");
      }
      debouncePlayAudio(audio);
   };

   const handlePauseContinueToggle = (isPaused: boolean) => {
      setPaused(isPaused);
      if (isPaused) workerPool.pause();
      else workerPool.continue();
   };

   return (
      <div className="2xl:max-w-[55%] xl:max-w-[65%] md:max-w-[75%] max-w-[90%] min-w-[634px] w-full h-full py-4 justify-center gap-6 flex flex-col">
         <audio ref={audioPlayer} />
         <SearchForm
            searching={searching}
            onSearch={handleSearch}
            onForceStop={handleSearchCancel}
            eventEmitter={eventEmitter.current}
            onPauseContinueToggle={handlePauseContinueToggle}
         />

         {(searching || searchResults.length > 0) && (
            <div className="no-scrollbar overflow-y-scroll flex flex-col bg-[#E9EAF3] rounded-2xl h-full">
               <SearchResults
                  tickets={searchResults}
                  loadedCount={loadedCount}
                  searchParams={searchParams}
                  searching={searching}
                  paused={paused}
                  doingCaptcha={doingCaptcha}
                  totalResultsCount={maxResultsCount}
                  enabledFlightCategories={enabledFlightCategories}
               />
            </div>
         )}
      </div>
   );
};

export default SearchPage;
