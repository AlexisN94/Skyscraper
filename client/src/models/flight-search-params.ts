import FlightCategory from 'constants/flight-category';
import FlightPlan from './flight-plan';
import FlightPlanModifiers from './flight-plan-modifiers';

type FlightSearchParams = FlightPlan & FlightPlanModifiers & {
  flightCategories: FlightCategory[]
};

export default FlightSearchParams;
