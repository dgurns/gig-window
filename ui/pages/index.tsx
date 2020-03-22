import { Typography, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Subheader from 'components/Subheader';

const useStyles = makeStyles(theme => ({
  pageContent: {
    backgroundColor: theme.palette.common.white,
    margin: 10
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
        <Grid item xs={12} md={10} lg={8} className={classes.pageContent}>
          Hello
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
