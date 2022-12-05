import DateFormat from 'constants/date-format';
import { Moment } from 'moment';
import React, { FC } from 'react';
import { IoIosAirplane } from 'react-icons/io';
import tailwindConfig from 'tailwind.config';

const NoFlightSegment: FC<{
   origin?: string;
   destination: string;
   departureDate: Moment;
}> = ({ origin, destination, departureDate }) => {
   return (
      <>
         {origin && <div>{origin}</div>}
         <div className="flex flex-col items-center font-semibold">
            <div>{departureDate.format(DateFormat.ticket)}</div>
            <div className="bg-blue my-[0.375rem] leading-[0] h-[0.125rem] flex gap-2 w-[90%] justify-between items-center relative">
               <IoIosAirplane
                  className="absolute right-0 translate-x-1/2 pl-[0.25rem] bg-white"
                  color={tailwindConfig.theme.extend.colors['blue']}
                  size={20}
               />
            </div>
         </div>
         <div>{destination}</div>
      </>
   );
};

export default NoFlightSegment;
