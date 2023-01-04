/* eslint-disable */
export default () => {
   function throwError(msg) {
      setTimeout(function () {
         throw new Error(msg);
      });
   }

   async function tryGetFlights(flightURL, backendURL, flightCategories, triesLeft) {
      if (triesLeft === 0) throwError('Server error. Make sure it is running.');
      try {
         const requestURL =
            `${backendURL}flights/` +
            `?url=${flightURL}` +
            `&flightCategories=${JSON.stringify(flightCategories)}`;
         const data = await fetch(requestURL, {
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
         return await tryGetFlights(flightURL, backendURL, flightCategories, triesLeft - 1);
      }
   }

   self.onmessage = async (event) => {
      const [flightURL, backendURL, flightCategories] = event.data;
      let data;

      while (!data) {
         data = await tryGetFlights(flightURL, backendURL, flightCategories, 2);
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
            data = null;
            await new Promise((res) => setTimeout(res, 500));
            continue;
         }

         postMessage(data);
      }
   };
};
