import React, { useMemo } from 'react';
import subHours from 'date-fns/subHours';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';
import useUsersStreamingLive from 'hooks/useUsersStreamingLive';
import useShows from 'hooks/useShows';
import Show from 'services/Show';

import ProjectOverviewSplash from 'components/ProjectOverviewSplash';
import LiveNowCard from 'components/LiveNowCard';
import UpcomingShowCard from 'components/UpcomingShowCard';

const useStyles = makeStyles(({ spacing, palette }) => ({
  pageContent: {
    padding: spacing(2),
    paddingBottom: spacing(10),
    paddingTop: spacing(4),
    width: '100%',
  },
  loadingIndicator: {
    marginBottom: spacing(4),
  },
  sectionHeading: {
    marginBottom: 15,
  },
  usersStreamingLive: {
    marginBottom: spacing(4),
  },
  liveCircle: {
    backgroundColor: palette.error.main,
    borderRadius: 7,
    height: 13,
    marginRight: spacing(1),
    marginTop: 1,
    width: 13,
  },
  showCard: {
    marginBottom: spacing(1),
  },
}));

const Home = () => {
  const classes = useStyles();

  const [currentUser, currentUserQuery] = useCurrentUser();
  const [usersStreamingLive, usersStreamingLiveQuery] = useUsersStreamingLive({
    fetchPolicy: 'cache-and-network',
  });

  const minShowtimeToFetch = useMemo(
    () => subHours(new Date(), 2).toISOString(),
    []
  );
  const [shows, showsQuery] = useShows({
    minShowtime: minShowtimeToFetch,
    take: 40,
    skip: 0,
    queryOptions: { fetchPolicy: 'cache-and-network' },
  });

  const { liveNowData, upcomingShowData } = useMemo(() => {
    if (
      typeof usersStreamingLive === 'undefined' ||
      typeof shows === 'undefined'
    ) {
      return {
        liveNowData: [],
        upcomingShowData: [],
      };
    }
    return Show.generateShowListingData(usersStreamingLive, shows);
  }, [usersStreamingLive, shows]);

  const liveShows = useMemo(
    () =>
      liveNowData.length > 0 && (
        <Grid item xs={12} className={classes.usersStreamingLive}>
          <Grid
            item
            container
            direction="row"
            alignItems="center"
            className={classes.sectionHeading}
          >
            <div className={classes.liveCircle} />
            <Typography variant="h6" color="error">
              Live now
            </Typography>
          </Grid>
          <Grid container item xs={12} spacing={2}>
            {liveNowData.map(({ user, show }, index) => {
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  className={classes.showCard}
                  key={index}
                >
                  <LiveNowCard user={user} show={show} />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      ),
    [liveNowData, classes]
  );

  const upcomingShows = useMemo(
    () =>
      upcomingShowData.length > 0 && (
        <>
          <Typography variant="h6" className={classes.sectionHeading}>
            Upcoming shows
          </Typography>
          <Grid item container xs={12} spacing={2}>
            {upcomingShowData.map((show, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                className={classes.showCard}
                key={index}
              >
                <UpcomingShowCard show={show} />
              </Grid>
            ))}
          </Grid>
        </>
      ),
    [upcomingShowData, classes]
  );

  const dataLoading = usersStreamingLiveQuery.loading || showsQuery.loading;
  const dataError = usersStreamingLiveQuery.error || showsQuery.error;
  const noData = !usersStreamingLive?.length && !shows?.length;

  const liveAndUpcomingShows = useMemo(() => {
    if (dataError) {
      return <Typography color="secondary">Error loading shows</Typography>;
    } else if (!dataLoading && noData) {
      return (
        <Typography color="secondary">No live or upcoming shows</Typography>
      );
    } else {
      return (
        <>
          {liveShows}
          {upcomingShows}
        </>
      );
    }
  }, [dataError, dataLoading, noData, liveShows, upcomingShows]);

  const shouldShowSplash = !currentUser && !currentUserQuery.loading;

  return (
    <Container maxWidth="md" disableGutters className={classes.pageContent}>
      {shouldShowSplash && <ProjectOverviewSplash />}
      {liveAndUpcomingShows}
    </Container>
  );
};

export default Home;
