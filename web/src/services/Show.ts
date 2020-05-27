import closestIndexTo from 'date-fns/closestIndexTo';
import DateTime from 'services/DateTime';

interface Show {
  id: number;
  title: string;
  showtime: string;
}

const getActiveShow = (shows?: Show[]): Show | undefined => {
  if (!shows || shows.length === 0) {
    return undefined;
  }

  const showtimes = shows.map((show) => new Date(show.showtime));
  const nearestShowtimeIndex = closestIndexTo(new Date(), showtimes);
  const nearestShow = shows[nearestShowtimeIndex];
  if (DateTime.showtimeIsStillActive(nearestShow.showtime)) {
    return nearestShow;
  } else {
    return shows[nearestShowtimeIndex + 1];
  }
};

export default {
  getActiveShow,
};
