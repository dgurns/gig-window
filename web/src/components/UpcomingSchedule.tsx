import React, { useEffect } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import ics from 'lib/ics';

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

  useEffect(() => {
    var cal = ics();
    if (!cal) {
      return;
    }
    cal.addEvent(
      'Subject',
      'Description',
      'Dublin',
      '2020-12-03T13:12:02.019Z',
      '2020-12-03T14:12:02.019Z',
      false
    );
    cal.download('myEvent', '.ics');
  }, []);

  return (
    <>
      <Typography variant="h4" className={classes.title}>
        Upcoming schedule
      </Typography>
      <Grid container direction="column">
        {shows.map((show, index) => {
          const shouldShowMinPrice = show.minPriceInCents > 100;
          return (
            <Grid item className={classes.show} key={index}>
              <Typography color="textSecondary">
                {DateTime.formatUserReadableShowtime(show.showtime)}
                {shouldShowMinPrice &&
                  ` • $${show.minPriceInCents / 100} or more`}
              </Typography>
              <Typography color="textPrimary">{show.title}</Typography>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default React.memo(UpcomingSchedule);
