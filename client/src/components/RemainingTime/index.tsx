import moment, { Moment, Duration } from 'moment';
import React, { useEffect, useMemo, useState } from 'react';

const RemainingTime = ({ loadedCount, totalCount }) => {
   const startTime = useMemo<Moment>(() => moment(), []);
   const [durationSinceStart, setDurationSinceStart] = useState<Duration>(moment.duration(0));
   const [remainingTime, setRemainingTime] = useState<Duration>(null);

   useEffect(() => {
      if (loadedCount === 0) return;
      const elapsedTimeInMs = durationSinceStart.asMilliseconds();
      const averageTimePerItem = elapsedTimeInMs / loadedCount;
      setRemainingTime(moment.duration((totalCount - loadedCount) * averageTimePerItem));
   }, [loadedCount]);

   useEffect(() => {
      const interval = setInterval(() => {
         const durationSinceStart = moment.duration(moment().diff(startTime));
         setDurationSinceStart(durationSinceStart);
      }, 1000);
      return () => {
         clearInterval(interval);
      };
   }, []);

   if (!remainingTime) return null;

   return (
      <div>
         {remainingTime.asMilliseconds() >= 1000
            ? <>
               {remainingTime.days() > 0 && <span>{remainingTime.days()}d</span>}
               {remainingTime.hours() > 0 && <span>{remainingTime.hours()}h</span>}
               {remainingTime.minutes() > 0 && <span>{remainingTime.minutes()}m</span>}
            </> : <>
               {'<1m'}
            </>
         }
      </div>
   );
};

export default RemainingTime;