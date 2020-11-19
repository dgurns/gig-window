import format from 'date-fns/format';
import startOfTomorrow from 'date-fns/startOfTomorrow';
import isEqual from 'date-fns/isEqual';
import isToday from 'date-fns/isToday';
import isTomorrow from 'date-fns/isTomorrow';
import addMinutes from 'date-fns/addMinutes';
import compareAsc from 'date-fns/compareAsc';
import differenceInMinutes from 'date-fns/differenceInMinutes';

const formatUserReadableShowtime = (showtime?: number | string) => {
  if (!showtime) return '';

  const showtimeAsDate = new Date(showtime);
  if (isEqual(showtimeAsDate, startOfTomorrow())) {
    return 'Today at midnight';
  } else if (isToday(showtimeAsDate)) {
    return format(showtimeAsDate, "'Today at' h:mm a");
  } else if (isTomorrow(showtimeAsDate)) {
    return format(showtimeAsDate, "'Tomorrow at' h:mm a");
  } else {
    return format(new Date(showtime), "LLLL d 'at' h:mm a");
  }
};

const formatUserReadableDate = (date?: number | string) => {
  if (!date) return '';
  return format(new Date(date), 'LLLL d');
};

const showtimeIsStillActive = (showtime?: string | number) => {
  if (!showtime) return;

  const ACTIVE_PERIOD_IN_MINUTES = 240;
  const activeDeadline = addMinutes(
    new Date(showtime),
    ACTIVE_PERIOD_IN_MINUTES
  );
  if (compareAsc(activeDeadline, new Date()) > -1) {
    return true;
  }
  return false;
};

const showtimeIsSoon = (showtime?: string | number): boolean => {
  if (!showtime) return false;

  const SOON_PERIOD_IN_MINUTES = 30;
  const minutesUntilShowtime = differenceInMinutes(
    new Date(showtime),
    new Date()
  );
  if (
    minutesUntilShowtime > 0 &&
    minutesUntilShowtime <= SOON_PERIOD_IN_MINUTES
  ) {
    return true;
  }
  return false;
};

export default {
  formatUserReadableShowtime,
  formatUserReadableDate,
  showtimeIsStillActive,
  showtimeIsSoon,
};
