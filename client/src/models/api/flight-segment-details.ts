type FlightSegmentDetails = {
   origin: string;
   destination: string;
   duration: string;
   departureTime: string;
   arrivalTime: string;
   stops: string[];
   airlines: string[];
   timeOffset?: string;
};

export default FlightSegmentDetails;
