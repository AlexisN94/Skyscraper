import FlightCategory from 'constants/flight-category';
import TicketModel from 'models/ticket-model';
import React, { FC, useEffect, useState } from 'react';
import { IoMdArrowRoundForward } from 'react-icons/io';
import tailwindConfig from 'tailwind.config';
import { pluralize } from 'utils/string';

import FlightSegment from 'components/FlightSegment/index';
import NoFlightSegment from 'components/NoFlightSegment/NoFlightSegment';

type TicketProps = { activeFlightCategory: FlightCategory; className: string } & TicketModel;

const Ticket: FC<TicketProps> = ({ activeFlightCategory, className, ...ticketModel }) => {
   const [activeFlightByCategory, setActiveFlightByCategory] = useState(ticketModel.cheapestFlight);

   useEffect(() => {
      switch (activeFlightCategory) {
         case FlightCategory.cheapest:
            setActiveFlightByCategory(ticketModel.cheapestFlight);
            break;
         case FlightCategory.fastest:
            setActiveFlightByCategory(ticketModel.fastestFlight);
            break;
         case FlightCategory.best:
            setActiveFlightByCategory(ticketModel.bestFlight);
            break;
      }
   }, [ticketModel, activeFlightCategory]);

   return (
      <a
         href={ticketModel.url}
         target="_blank"
         rel="noreferrer"
         className={
            className +
            ' w-full text-center flex align-middle flex-wrap lg:flex-nowrap items-center hover:cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-lg shadow-neutral-400 hover:shadow-neutral-400 transition-all duration-200 text-sm'
         }
      >
         {!ticketModel.noFlights ? (
            <div className="flex flex-col w-full gap-6 p-5">
               <FlightSegment
                  departureDate={ticketModel.departureDate}
                  {...activeFlightByCategory.outboundSegment}
               />
               {!ticketModel.oneWay && (
                  <FlightSegment
                     departureDate={ticketModel.returnDate}
                     {...activeFlightByCategory.inboundSegment}
                  />
               )}
            </div>
         ) : (
            <div className="flex flex-col gap-5 w-full">
               <div className="flex w-full items-center justify-evenly">
                  <NoFlightSegment
                     origin={ticketModel.origin}
                     destination={ticketModel.destination}
                     departureDate={ticketModel.departureDate}
                  />
                  {!ticketModel.oneWay && (
                     <NoFlightSegment
                        destination={ticketModel.origin}
                        departureDate={ticketModel.returnDate}
                     />
                  )}
               </div>
            </div>
         )}

         <div className="flex lg:flex-col justify-end lg:h-full lg:justify-center items-center lg:border-t-0 border-t-gray-200 border-t-2 w-full lg:w-auto lg:border-l-gray-200 lg:border-l-2 text-lg lg:gap-1 gap-4 py-5 px-9">
            <div className="flex gap-1 flex-col items-center font-semibold">
               {!ticketModel.noFlights ? (
                  <div>{activeFlightByCategory.price}€</div>
               ) : (
                  <div className="text-sm">No flights</div>
               )}
               <div className="font-normal text-[0.8rem] text-gray-600">
                  {pluralize(ticketModel.nights, 'night')}
               </div>
            </div>
            <button className="bg-blue hover:bg-dark-blue text-base gap-2 flex transition-all duration-150 items-center w-fit text-white rounded-md px-3 py-2">
               <div>Open</div>
               <IoMdArrowRoundForward
                  color={tailwindConfig.theme.extend.colors['white']}
                  size={24}
               />
            </button>
         </div>
      </a>
   );
};

export default Ticket;
