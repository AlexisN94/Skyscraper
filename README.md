# Skyscraper

Scraper for Skyscanner. My main purpose was to automate searching for the cheapest flight between a flexible range of dates.

### Screenshots

<div>
  <img src="https://github.com/AlexisN94/Skyscraper/blob/main/screenshots/1.png" width=32%/>
  <img src="https://github.com/AlexisN94/Skyscraper/blob/main/screenshots/2.png" width=32%/>
  <img src="https://github.com/AlexisN94/Skyscraper/blob/main/screenshots/3.png" width=32%/>
</div>

### Frontend

You can specify an origin and a destination (by aiport codes, which you can easily find on Google), a range of dates to fly within and a minimum and maximum number of nights to stay at your destination. You can also search one-way and weekend-only flights.

For example, if you want to travel between 1/Aug and 8/Aug and want to stay between 5 to 7 nights, the app will search for the cheapest flight on each of the possible dates:

<pre>
  1/Aug - 6/Aug (5 nights)
  2/Aug - 7/Aug (5 nights)
  3/Aug - 8/Aug (5 nights)
  1/Aug - 7/Aug (6 nights)
  2/Aug - 8/Aug (6 nights)
  1/Aug - 8/Aug (7 nights)
</pre>

You can sort the results by price (default), average flight duration, stay duration, departure date and return date.

You might be occasionally prompted by Skyscanner to complete CAPTCHAs.

### Backend

The only endpoint is `/flights` and it requires an `url` parameter.  
E.g. `http://localhost:4001/flights?url=https://www.skyscanner.pt/transport/flights/opo/hkg/230114/230122/`

<details>
  <summary>Response model</summary>
<pre>
{
  noFlights: boolean;
  doingCaptcha?: boolean;
  noInternet?: boolean;
  bestFlight?: {
    avgDuration: string;
    price: number;
    outboundSegment: {
      origin: string;
      destination: string;
      duration: string;
      departureTime: string;
      arrivalTime: string;
      stops: string[];
      airlines: string[];
      timeOffset?: string;
    };
    inboundSegment?: {
      origin: string;
      destination: string;
      duration: string;
      departureTime: string;
      arrivalTime: string;
      stops: string[];
      airlines: string[];
      timeOffset?: string;
    };
  };
  cheapestFlight?: {
    avgDuration: string;
    price: number;
    outboundSegment: {
      origin: string;
      destination: string;
      duration: string;
      departureTime: string;
      arrivalTime: string;
      stops: string[];
      airlines: string[];
      timeOffset?: string;
    };
    inboundSegment?: {
      origin: string;
      destination: string;
      duration: string;
      departureTime: string;
      arrivalTime: string;
      stops: string[];
      airlines: string[];
      timeOffset?: string;
    };
  };
  fastestFlight?: {
    avgDuration: string;
    price: number;
    outboundSegment: {
      origin: string;
      destination: string;
      duration: string;
      departureTime: string;
      arrivalTime: string;
      stops: string[];
      airlines: string[];
      timeOffset?: string;
    };
    inboundSegment?: {
      origin: string;
      destination: string;
      duration: string;
      departureTime: string;
      arrivalTime: string;
      stops: string[];
      airlines: string[];
      timeOffset?: string;
    };
  };
}
</pre>
</details>

## To install

Make sure you have <a href="https://nodejs.org/en/">Node.js</a> installed first.

#### Unix:

- Run <ins>install.sh</ins>

#### Windows:

- Run <ins>install.bat</ins>

## To run

#### Unix:

1. Run <ins>start.sh</ins>
2. Open http://localhost:3000/
3. When you're done, open the Terminal windows that launched when you ran start.sh, then press CTRL+C

#### Windows:

1. Run <ins>start.bat</ins>
2. Open http://localhost:3000/
3. When you're done, go to the Command Prompt windows that opened when you ran start.bat, then press CTRL+C (just closing the Command Prompt windows isn't enough)

## TODO

- Search by airport name
- Form validation
- Backend caching
- Responsive design
- Save results to file
- Snackbar
