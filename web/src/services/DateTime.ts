import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import isTomorrow from 'date-fns/isTomorrow';
import addMinutes from 'date-fns/addMinutes';
import compareAsc from 'date-fns/compareAsc';

const formatUserReadableShowtime = (showtime?: number | string) => {
  if (!showtime) return '';

  const showtimeAsDate = new Date(showtime);
  if (isToday(showtimeAsDate)) {
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

export default {
  formatUserReadableShowtime,
  formatUserReadableDate,
  showtimeIsStillActive,
};
