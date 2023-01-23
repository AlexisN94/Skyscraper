import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import DateFormat from 'constants/date-format';
import FlightCategory from 'constants/flight-category';
import TicketModel from 'models/ticket-model';
import React, { FC } from 'react';
import { MdLaunch } from 'react-icons/md';
import tailwindConfig from 'tailwind.config';
import Ticket from 'components/Ticket/index';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';

type Props = {
   oneWay: boolean;
   tickets: TicketModel[];
   compact?: boolean;
   activeFlightCategory: FlightCategory;
};

const ResultsList: FC<Props> = ({ oneWay, tickets, compact, activeFlightCategory }) => {
   return (
      <>
         {compact ? (
            <div className="h-full overflow-y-scroll">
               <Table size="small" stickyHeader>
                  <TableHead>
                     <TableRow
                        sx={{
                           '& .MuiTableCell-root': {
                              color: tailwindConfig.theme.extend.colors['dark-blue'],
                              fontWeight: 700,
                              fontSize: '0.94rem',
                              backgroundColor: '#E9EAF3',
                              zIndex: 1,
                           },
                        }}
                     >
                        <TableCell align="center">Origin</TableCell>
                        <TableCell align="center">Destination</TableCell>
                        <TableCell align="center">Departure</TableCell>
                        {!oneWay && <TableCell align="center">Return</TableCell>}
                        {!oneWay && <TableCell align="center">Stay duration</TableCell>}
                        <TableCell align="center">Avg. Flight Duration</TableCell>
                        <TableCell align="center">Price</TableCell>
                        <TableCell align="center">Link</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {tickets.map((row) => (
                        <TableRow
                           key={row.url}
                           sx={{
                              '& .MuiTableCell-root': {
                                 backgroundColor: 'inherit',
                                 color: tailwindConfig.theme.extend.colors['dark-blue'],
                                 fontWeight: 700,
                              },
                           }}
                        >
                           <TableCell align="center">{row.origin}</TableCell>
                           <TableCell align="center">{row.destination}</TableCell>
                           <TableCell align="center">
                              {row.departureDate.format(DateFormat.ticket)}
                           </TableCell>
                           {!oneWay && (
                              <TableCell align="center">
                                 {row.returnDate.format(DateFormat.ticket)}
                              </TableCell>
                           )}
                           {!oneWay && (
                              <TableCell align="center">{`${row.nights} nights`}</TableCell>
                           )}
                           <TableCell align="center">
                              {`${row[activeFlightCategory + 'Flight'].avgDuration ?? 'N/A'}`}
                           </TableCell>
                           <TableCell align="center">
                              {row.noFlights
                                 ? 'No flights'
                                 : `${row[activeFlightCategory + 'Flight'].price}€`}
                           </TableCell>
                           <TableCell align="center">
                              <a
                                 href={row.url}
                                 className="underline max-w-min m-auto flex items-center"
                                 target="_blank"
                                 rel="noreferrer"
                              >
                                 <MdLaunch
                                    color={tailwindConfig.theme.extend.colors['dark-blue']}
                                    size={20}
                                 />
                              </a>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </div>
         ) : (
            <div
               className={`text-dark-blue h-full px-16 flex flex-col gap-4 py-4 font-bold text-center overflow-y-scroll`}
            >
               {tickets.length > 0 &&
                  <AutoSizer>
                     {({ height, width }) => (
                        <List
                           height={height}
                           className={"no-scrollbar"}
                           width={width}
                           itemSize={180}
                           itemCount={tickets.length}
                        >
                           {({ _, index, style }) => (
                              <div style={style}>
                                 <Ticket
                                    {...tickets[index]}
                                    key={tickets[index].url}
                                    activeFlightCategory={activeFlightCategory}
                                    className={`text-dark-blue`}
                                 />
                              </div>
                           )}
                        </List>
                     )}
                  </AutoSizer>
               }
            </div>
         )
         }
      </>
   );
};

export default ResultsList;
