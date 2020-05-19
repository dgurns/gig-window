import format from 'date-fns/format';
import addHours from 'date-fns/addHours';

const createDefaultShowtime = () => {
  const date = new Date();
  date.setMinutes(0);
  date.setSeconds(0);
  return addHours(date, 1);
};

const formatUserReadableShowtime = (showtimeInUtc?: string) => {
  if (!showtimeInUtc) return '';

  return format(new Date(parseInt(showtimeInUtc)), "LLLL d 'at' h:mm a");
};

export default {
  createDefaultShowtime,
  formatUserReadableShowtime,
};
