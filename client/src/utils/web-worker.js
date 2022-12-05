/* eslint-disable */
export default () => {
   function throwError(msg) {
      setTimeout(function () {
         throw new Error(msg);
      });
   }

   async function tryGetFlights(flightURL, backendURL, triesLeft) {
      if (triesLeft === 0) throwError('Server error. Make sure it is running.');
      try {
         const data = await fetch(backendURL + 'flights/?url=' + flightURL, {
            method: 'GET',
            mode: 'cors',
            headers: {
               'Content-type': 'application/json',
            },
         });
         return await data?.json();
      } catch (e) {
         console.error(e);
         await new Promise((res) => setTimeout(res, 2000));
         return await tryGetFlights(flightURL, backendURL, triesLeft - 1);
      }
   }

   self.onmessage = async (event) => {
      const [flightURL, backendURL] = event.data;
      let data;

      while (!data) {
         data = await tryGetFlights(flightURL, backendURL, 2);
         if (!data) {
            await new Promise((res) => setTimeout(res, 500));
            continue;
         }
         if (data?.doingCaptcha) {
            postMessage({ doingCaptcha: true });
            data = null;
            await new Promise((res) => setTimeout(res, 5000));
            continue;
         }
         if (data?.noInternet) {
            throwError('No internet connection.');
            return;
         }
         if (!data.bestFlight || !data.cheapestFlight || !data.fastestFlight) {
            console.log('empty data on flightURL', flightURL, data);
            await new Promise((res) => setTimeout(res, 500));
            continue;
         }

         postMessage(data);
      }
   };
};
