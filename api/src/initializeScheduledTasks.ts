import LiveVideoInfrastructure from 'services/LiveVideoInfrastructure';

const deleteStaleResources = async () => {
  try {
    const liveVideoResourcesDeleted = await LiveVideoInfrastructure.deleteStaleResources();
    console.log(
      `Scheduled task: Deleted ${liveVideoResourcesDeleted} live video resources`
    );
  } catch (error) {
    console.log(
      'Scheduled task: Error deleting stale live video resources',
      error?.message ? `- ${error.message}` : ''
    );
  }
};

export const initializeScheduledTasks = () => {
  setInterval(() => deleteStaleResources(), 1000 * 60 * 15); // Every 15 minutes
};
