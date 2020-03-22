import { Typography, Grid, Paper } from '@material-ui/core';
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
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="center"
      >
        <Grid
          item
          container
          xs={12}
          md={10}
          lg={8}
          direction="column"
          className={classes.pageContent}
        >
          <Typography variant="h5" className={classes.sectionHeading}>
            Live now
          </Typography>
          <Grid
            container
            item
            xs={12}
            spacing={2}
            className={classes.showCards}
          >
            <Grid item xs={12} sm={6} xl={4}>
              <ShowCard />
            </Grid>
            <Grid item xs={12} sm={6} xl={4}>
              <ShowCard />
            </Grid>
            <Grid item xs={12} sm={6} xl={4}>
              <ShowCard />
            </Grid>
          </Grid>

          <Typography variant="h5" className={classes.sectionHeading}>
            7:30 pm
          </Typography>
          <Grid
            container
            item
            xs={12}
            spacing={2}
            className={classes.showCards}
          >
            <Grid item xs={12} sm={6} xl={4}>
              <ShowCard />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
