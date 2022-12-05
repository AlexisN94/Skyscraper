import DateFormat from 'constants/date-format';
import FlightSegmentDetails from 'models/api/flight-segment-details';
import FlightPlan from 'models/flight-plan';
import React, { FC } from 'react';
import { IoIosAirplane } from 'react-icons/io';
import tailwindConfig from 'tailwind.config';
import { parseDuration } from 'utils/date';
import { pluralize } from 'utils/string';

const FlightSegment: FC<FlightPlan & FlightSegmentDetails> = (props) => {
   return (
      <div className="flex items-center w-full justify-between gap-2">
         <div className={`font-medium text-gray-500 text-xs leading-5 whitespace-pre`}>
            {props.airlines?.join(' +\n')}
         </div>

         <div className="flex basis-[78%] items-center">
            <div className="text-md flex basis-[10%] justify-center text-gray-500 font-medium">
               {props.origin}
            </div>

            <div className="text-sm flex flex-col items-end justify-center gap-1 basis-[25%] font-bold w-full">
               <div>{props.departureDate.format(DateFormat.ticket)}</div>
               <div className="text-gray-500 font-semibold">{props.departureTime}</div>
            </div>

            <div className="flex flex-col items-center text-xs justify-center basis-[30%] font-medium w-full mx-3.5 gap-1">
               <div>{props.duration}</div>
               <div className="bg-blue my-[0.375rem] leading-[0] h-[0.125rem] mx-auto flex gap-2 w-[90%] justify-between items-center relative">
                  <IoIosAirplane
                     className="absolute right-0 translate-x-1/2 pl-[0.25rem] bg-white"
                     color={tailwindConfig.theme.extend.colors['blue']}
                     size={20}
                  />
                  <div className="gap-2 flex relative w-full justify-center">
                     {props.stops.map((stop) => (
                        <span
                           key={stop}
                           className="rounded-full h-2.5 w-2.5 bg-white items-center justify-center flex"
                        >
                           <span className="rounded-full bg-red-600 h-1.5 w-1.5" />
                        </span>
                     ))}
                  </div>
               </div>
               {props.stops.length > 0 && (
                  <div>
                     <span className="text-red-600">{pluralize(props.stops.length, 'stop')}</span>{' '}
                     {props.stops.join(', ')}
                  </div>
               )}{' '}
               {props.stops.length === 0 && <div className="text-emerald-600">Non-stop</div>}
            </div>

            <div className="text-sm flex flex-col items-start justify-center gap-1 basis-[25%] font-bold w-full">
               <div>
                  {props.departureDate
                     .clone()
                     .add(parseDuration(props.duration), 'm')
                     .format(DateFormat.ticket)}
               </div>
               <div className="text-gray-500 font-semibold">{props.arrivalTime}</div>
            </div>

            <div className="text-md flex basis-[10%] justify-center text-gray-500 font-medium">
               {props.destination}
            </div>
         </div>
      </div>
   );
};

export default FlightSegment;
