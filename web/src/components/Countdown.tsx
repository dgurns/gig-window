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
  targetDate: string;
  countdownSuffix?: string;
  postTargetLabel?: string;
  onTargetDateReached?: () => void;
  className?: string;
}

const Countdown = ({
  targetDate,
  countdownSuffix,
  postTargetLabel,
  onTargetDateReached,
  className,
}: CountdownProps) => {
  const isAfterTargetDate = new Date() > new Date(targetDate);

  const calculateTimeOffsets = useCallback(() => {
    const now = new Date();
    const reference = new Date(targetDate);

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
  }, [targetDate]);

  const [timeOffsets, setTimeOffsets] = useState(calculateTimeOffsets());
  const { days, hours, minutes, seconds } = timeOffsets;

  const [shouldTriggerCallback, setShouldTriggerCallback] = useState(false);

  useEffect(() => {
    if (isAfterTargetDate) return;

    const timer = setInterval(() => {
      setTimeOffsets(calculateTimeOffsets());
      if (new Date() > new Date(targetDate)) {
        setShouldTriggerCallback(true);
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeOffsets, targetDate, isAfterTargetDate]);

  useEffect(() => {
    if (shouldTriggerCallback && onTargetDateReached) {
      onTargetDateReached();
    }
  }, [shouldTriggerCallback, onTargetDateReached]);

  return (
    <Typography color="inherit" className={className}>
      {isAfterTargetDate || shouldTriggerCallback ? (
        postTargetLabel
      ) : (
        <>
          {days && `${days} day${days !== 1 ? 's' : ''}, `}
          {hours && `${hours} hour${hours !== 1 ? 's' : ''}, `}
          {minutes && `${minutes} minute${minutes !== 1 ? 's' : ''}, `}
          {`${seconds} second${seconds !== 1 ? 's' : ''} ${countdownSuffix}`}
        </>
      )}
    </Typography>
  );
};

export default React.memo(Countdown);
