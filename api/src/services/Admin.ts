import { getManager } from 'typeorm';
import subMinutes from 'date-fns/subMinutes';
import { User } from 'entities/User';

const getUsersWithStaleMediaLiveChannels = async (): Promise<User[]> => {
  const MAX_INACTIVITY_PERIOD_MINUTES = 15;
  const staleTimestampMarker = subMinutes(
    Date.now(),
    MAX_INACTIVITY_PERIOD_MINUTES
  );
  const staleTimestampMarkerAsSqlString = staleTimestampMarker
    .toISOString()
    .replace('T', ' ');

  const usersWithStaleMediaLiveChannels = await getManager()
    .createQueryBuilder(User, 'user')
    .where('user.awsMediaLiveChannelId IS NOT NULL')
    .andWhere('user.lastPublishedStreamEndTimestamp IS NOT NULL')
    .andWhere(
      'user.lastPublishedStreamEndTimestamp < :staleTimestampMarkerAsSqlString',
      {
        staleTimestampMarkerAsSqlString,
      }
    )
    .getMany();

  return usersWithStaleMediaLiveChannels;
};

export default {
  getUsersWithStaleMediaLiveChannels,
};
