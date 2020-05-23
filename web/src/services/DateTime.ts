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

const formatUserReadableShowtime = (showtimeInUtc?: string) => {
  if (!showtimeInUtc) return '';

  return format(new Date(showtimeInUtc), "LLLL d 'at' h:mm a");
};

export default {
  createDefaultShowtime,
  formatUserReadableShowtime,
};
