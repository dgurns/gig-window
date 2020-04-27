import { getManager } from 'typeorm';
import { User } from 'entities/User';

const getUsersWithStaleMediaLiveChannels = async (): Promise<User[]> => {
  const MAX_INACTIVITY_PERIOD_MILLISECONDS = 900000; // 15 minutes
  const staleTimestampMarker = Date.now() - MAX_INACTIVITY_PERIOD_MILLISECONDS;

  const usersWithStaleMediaLiveChannels = await getManager()
    .createQueryBuilder(User, 'user')
    .where('user.awsMediaLiveChannelId != ""')
    .andWhere('user.lastPublishedStreamEndTimestamp != ""')
    .andWhere('user.lastPublishedStreamEndTimestamp < :staleTimestampMarker', {
      staleTimestampMarker,
    })
    .getMany();

  return usersWithStaleMediaLiveChannels;
};

export default {
  getUsersWithStaleMediaLiveChannels,
};
