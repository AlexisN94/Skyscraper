import FlightSegment from "./flight-segment";

type Flight = {
  avgDuration: string;
  price: number;
  outboundSegment: FlightSegment;
  inboundSegment?: FlightSegment;
};

export default Flight;
