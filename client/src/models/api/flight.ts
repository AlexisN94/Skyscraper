import FlightSegmentDetails from './flight-segment-details';

type Flight = {
   price: number;
   avgDuration: string;
   outboundSegment: FlightSegmentDetails;
   inboundSegment?: FlightSegmentDetails;
};

export default Flight;
