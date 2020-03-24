import React from 'react';
import { Container, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Subheader from 'components/Subheader';
import ShowCard from 'components/ShowCard';

const useStyles = makeStyles(theme => ({
  pageContent: {
    padding: 10,
    paddingTop: 35,
    width: '100%'
  },
  sectionHeading: {
    marginBottom: 15
  },
  showCards: {
    marginBottom: 35
  }
}));

const Home = () => {
  const classes = useStyles();

  return (
    <>
      <Subheader>
        <Typography variant="body1">Today</Typography>
      </Subheader>
      <Container maxWidth="md" disableGutters className={classes.pageContent}>
        <Typography variant="h5" className={classes.sectionHeading}>
          Live now
        </Typography>
        <Grid container item xs={12} spacing={2} className={classes.showCards}>
          <Grid item xs={12} sm={6}>
            <ShowCard />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ShowCard />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ShowCard />
          </Grid>
        </Grid>

        <Typography variant="h5" className={classes.sectionHeading}>
          7:30 pm
        </Typography>
        <Grid container item xs={12} spacing={2} className={classes.showCards}>
          <Grid item xs={12} sm={6}>
            <ShowCard />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home;
