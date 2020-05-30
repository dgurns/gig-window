import React, { useState, useEffect, useCallback } from 'react';
import differenceInDays from 'date-fns/differenceInDays';
import differenceInHours from 'date-fns/differenceInHours';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import addHours from 'date-fns/addHours';
import addDays from 'date-fns/addDays';
import addMinutes from 'date-fns/addMinutes';

import Typography from '@material-ui/core/Typography';

interface CountdownProps {
  showtime: string;
}

const Countdown = (props: CountdownProps) => {
  const calculateTimeOffsets = useCallback(() => {
    const now = new Date();
    const reference = new Date(props.showtime);

    const days = differenceInDays(reference, now);
    const offsetDisregardingDays = addDays(now, days);
    const hours = differenceInHours(reference, offsetDisregardingDays);
    const offsetDisregardingHours = addHours(offsetDisregardingDays, hours);
    const minutes = differenceInMinutes(reference, offsetDisregardingHours);
    const offsetDisregardingMinutes = addMinutes(
      offsetDisregardingHours,
      minutes
    );
    const seconds = differenceInSeconds(reference, offsetDisregardingMinutes);

    return {
      days: days > 0 ? days : undefined,
      hours: hours > 0 ? hours : undefined,
      minutes: minutes > 0 ? minutes : undefined,
      seconds: seconds,
    };
  }, [props.showtime]);

  const [timeOffsets, setTimeOffsets] = useState(calculateTimeOffsets());
  const { days, hours, minutes, seconds } = timeOffsets;

  useEffect(() => {
    const timer = setInterval(
      () => setTimeOffsets(calculateTimeOffsets()),
      1000
    );
    return () => clearInterval(timer);
  }, [calculateTimeOffsets]);

  const isAfterShowtime = new Date() > new Date(props.showtime);

  return (
    <Typography color="secondary">
      {isAfterShowtime ? (
        'Waiting for show to begin'
      ) : (
        <>
          {days && `${days} day${days !== 1 ? 's' : ''}, `}
          {hours && `${hours} hour${hours !== 1 ? 's' : ''}, `}
          {minutes && `${minutes} minute${minutes !== 1 ? 's' : ''}, `}
          {`${seconds} second${seconds !== 1 ? 's' : ''} until showtime`}
        </>
      )}
    </Typography>
  );
};

export default React.memo(Countdown);
