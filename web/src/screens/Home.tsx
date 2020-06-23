import React, { useMemo } from 'react';
import subHours from 'date-fns/subHours';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { makeStyles } from '@material-ui/core/styles';

import useUsersStreamingLive from 'hooks/useUsersStreamingLive';
import useShows from 'hooks/useShows';
import Show from 'services/Show';

import Subheader from 'components/Subheader';
import LiveNowCard from 'components/LiveNowCard';
import UpcomingShowCard from 'components/UpcomingShowCard';

const useStyles = makeStyles(({ spacing }) => ({
  pageContent: {
    padding: spacing(2),
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
  showCard: {
    marginBottom: spacing(1),
  },
}));

const Home = () => {
  const classes = useStyles();

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

  const { liveNowData, upcomingShowData } = useMemo(
    () => Show.generateShowListingData(usersStreamingLive, shows),
    [usersStreamingLive, shows]
  );

  const renderLiveNow = () => (
    <Grid item xs={12} className={classes.usersStreamingLive}>
      <Typography variant="h6" className={classes.sectionHeading}>
        Live now
      </Typography>
      <Grid container item xs={12} spacing={2}>
        {liveNowData.map(({ user, show }, index) => {
          return (
            <Grid item xs={12} sm={6} className={classes.showCard} key={index}>
              <LiveNowCard user={user} show={show} />
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );

  const renderUpcomingShows = () => (
    <>
      <Typography variant="h6" className={classes.sectionHeading}>
        Upcoming shows
      </Typography>
      <Grid item container xs={12} spacing={2}>
        {upcomingShowData.map((show, index) => (
          <Grid item xs={12} sm={6} className={classes.showCard} key={index}>
            <UpcomingShowCard show={show} />
          </Grid>
        ))}
      </Grid>
    </>
  );

  const dataLoading = usersStreamingLiveQuery.loading && showsQuery.loading;
  const dataError = usersStreamingLiveQuery.error || showsQuery.error;
  const noData = !usersStreamingLive && !shows;

  const renderContent = () => {
    if (dataLoading) {
      return <Typography color="secondary">Loading...</Typography>;
    } else if (dataError) {
      return (
        <Typography color="secondary">
          Error loading shows. Please reload the page
        </Typography>
      );
    } else if (noData) {
      return (
        <Typography color="secondary">No live or upcoming shows</Typography>
      );
    } else {
      return (
        <>
          {liveNowData.length > 0 && renderLiveNow()}
          {upcomingShowData.length > 0 && renderUpcomingShows()}
        </>
      );
    }
  };

  return (
    <>
      <Subheader>
        <Typography variant="body1">Today</Typography>
      </Subheader>
      <Container maxWidth="md" disableGutters className={classes.pageContent}>
        {renderContent()}
      </Container>
    </>
  );
};

export default Home;
