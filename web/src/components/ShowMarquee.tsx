import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import Countdown from './Countdown';

interface ShowMarqueeProps {
  show: {
    id: number;
    title: string;
    showtime: string;
  };
}

const useStyles = makeStyles(({ palette, spacing }) => ({
  container: {
    background: 'url("images/curtains.jpg")',
    backgroundColor: palette.common.black,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    height: '100%',
  },
  countdown: {
    margin: spacing(2),
  },
}));

const ShowMarquee = (props: ShowMarqueeProps) => {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.container}
    >
      <Grid item className={classes.countdown}>
        <Countdown showtime={props.show.showtime} />
      </Grid>
      <Button variant="contained" size="large" color="primary">
        Pay what you want
      </Button>
    </Grid>
  );
};

export default ShowMarquee;
