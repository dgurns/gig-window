import React, { useMemo } from 'react';
import subHours from 'date-fns/subHours';
import subMinutes from 'date-fns/subMinutes';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import { makeStyles } from '@material-ui/core/styles';

import useShows from 'hooks/useShows';

import Subheader from 'components/Subheader';
import UpcomingShowCard from 'components/UpcomingShowCard';

const useStyles = makeStyles(({ spacing }) => ({
  pageContent: {
    padding: spacing(2),
    paddingTop: spacing(4),
    width: '100%',
  },
  sectionHeading: {
    marginBottom: 15,
  },
  upcomingShowCards: {
    marginBottom: spacing(4),
  },
  showCard: {
    marginBottom: spacing(1),
  },
}));

const Home = () => {
  const classes = useStyles();

  const minShowtimeToFetch = useMemo(
    () => subHours(new Date(), 3).toISOString(),
    []
  );
  const [shows = [], showsQuery] = useShows({
    minShowtime: minShowtimeToFetch,
    take: 30,
    skip: 0,
    queryOptions: { fetchPolicy: 'cache-and-network' },
  });

  const upcomingShowThreshold = useMemo(() => subMinutes(new Date(), 15), []);
  const upcomingShows = shows.filter(
    ({ showtime }) => new Date(showtime) > upcomingShowThreshold
  );

  const renderUpcomingShows = () => {
    if (showsQuery.loading) {
      return <CircularProgress color="secondary" />;
    } else if (showsQuery.error) {
      return (
        <Typography color="secondary">Error loading upcoming shows</Typography>
      );
    } else {
      return (
        <Grid item container xs={12} spacing={2}>
          {upcomingShows.map((show, index) => (
            <Grid item xs={12} sm={6} className={classes.showCard} key={index}>
              <UpcomingShowCard show={show} />
            </Grid>
          ))}
        </Grid>
      );
    }
  };

  return (
    <>
      <Subheader>
        <Typography variant="body1">Today</Typography>
      </Subheader>
      <Container maxWidth="md" disableGutters className={classes.pageContent}>
        <Typography variant="h6" className={classes.sectionHeading}>
          Upcoming shows
        </Typography>
        <Grid item xs={12} className={classes.upcomingShowCards}>
          {renderUpcomingShows()}
        </Grid>
      </Container>
    </>
  );
};

export default Home;
