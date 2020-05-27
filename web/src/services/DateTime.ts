import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import addHours from 'date-fns/addHours';

const createDefaultShowtime = () => {
  const date = new Date();
  date.setMinutes(0);
  date.setSeconds(0);
  const futureTime = addHours(date, 1);
  return addDays(futureTime, 5);
};

const formatUserReadableShowtime = (showtime?: number | string) => {
  if (!showtime) return '';
  return format(new Date(showtime), "LLLL d 'at' h:mm a");
};

export default {
  createDefaultShowtime,
  formatUserReadableShowtime,
};
