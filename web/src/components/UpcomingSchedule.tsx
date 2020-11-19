import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Show } from 'types';
import DateTime from 'services/DateTime';

const useStyles = makeStyles(({ spacing }) => ({
  title: {
    marginBottom: spacing(2),
  },
  show: {
    marginBottom: spacing(2),
  },
}));

interface Props {
  shows?: Show[];
}

const UpcomingSchedule = ({ shows = [] }: Props) => {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h4" className={classes.title}>
        Upcoming schedule
      </Typography>
      <Grid container direction="column">
        {shows.map((show, index) => (
          <Grid item className={classes.show} key={index}>
            <Typography color="textSecondary">
              {DateTime.formatUserReadableShowtime(show.showtime)}
            </Typography>
            <Typography color="textPrimary">{show.title}</Typography>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default React.memo(UpcomingSchedule);
