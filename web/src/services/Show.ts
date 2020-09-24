import closestIndexTo from 'date-fns/closestIndexTo';
import subMinutes from 'date-fns/subMinutes';
import difference from 'lodash/difference';
import DateTime from 'services/DateTime';
import { Show, User } from 'types';

const filterShowsByUser = (shows: Show[], userId: number) => {
  return shows.filter((show) => show.user.id === userId);
};

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

interface LiveNowDataItem {
  user: User;
  show?: Show;
}

const generateLiveNowData = (
  usersStreamingLive: User[] = [],
  shows: Show[] = []
): LiveNowDataItem[] => {
  return usersStreamingLive.map((user) => {
    const showsByUser = filterShowsByUser(shows, user.id);
    const activeShow = getActiveShow(showsByUser);
    if (!activeShow) {
      return {
        user,
        show: undefined,
      };
    }
    const activeShowAlreadyStarted =
      new Date(activeShow.showtime) <= new Date();
    if (activeShowAlreadyStarted) {
      return { user, show: activeShow };
    }
    const activeShowStartsSoon = DateTime.showtimeIsSoon(activeShow.showtime);
    return {
      user,
      show: activeShowStartsSoon ? activeShow : undefined,
    };
  });
};

const generateUpcomingShowData = (shows: Show[] = []): Show[] => {
  const upcomingShowThreshold = subMinutes(new Date(), 15);
  const upcomingShows = shows.filter(
    ({ showtime }) => new Date(showtime) > upcomingShowThreshold
  );
  return upcomingShows;
};

interface GenerateShowDataResult {
  liveNowData: LiveNowDataItem[];
  upcomingShowData: Show[];
}

const generateShowListingData = (
  usersStreamingLive: User[] = [],
  shows: Show[] = []
): GenerateShowDataResult => {
  const liveNowData = generateLiveNowData(usersStreamingLive, shows);
  const showsIncludedInLiveNow: Show[] = [];
  liveNowData.forEach((item) => {
    if (item.show) {
      showsIncludedInLiveNow.push(item.show);
    }
  });
  const showsNotIncludedInLiveNow = difference(shows, showsIncludedInLiveNow);
  const upcomingShowData = generateUpcomingShowData(showsNotIncludedInLiveNow);
  return {
    liveNowData,
    upcomingShowData,
  };
};

export default {
  filterShowsByUser,
  getActiveShow,
  generateLiveNowData,
  generateUpcomingShowData,
  generateShowListingData,
};
