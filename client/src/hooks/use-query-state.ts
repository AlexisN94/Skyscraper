import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { getURLQuery, setURLQuery } from 'utils/url-query';

export const useQueryState = <T>(
   query: string,
   defaultValue: T,
   as?: (parsedJSON: any) => T
): [state: T, setQuery: React.Dispatch<React.SetStateAction<T>>] => {
   const [state, setState] = useState<T>(defaultValue);
   const debounceSetURLQuery = useCallback(
      _.debounce((value: string) => setURLQuery(query, value), 500),
      []
   );

   const setQuery = (value: T) => {
      setState(value);
      debounceSetURLQuery(JSON.stringify(value));
   };

   useEffect(() => {
      const value = getURLQuery(query);
      if (!value || value === 'null') return;
      if (as) {
         setState(as(JSON.parse(getURLQuery(query))));
      } else {
         setState(JSON.parse(getURLQuery(query)) as T);
      }
   }, [query]);

   return [state, setQuery];
};
