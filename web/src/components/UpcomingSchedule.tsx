import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import addMinutes from 'date-fns/addMinutes';

import ics from 'lib/ics';

import { Show, User } from 'types';
import DateTime from 'services/DateTime';
import TextButton from 'components/TextButton';

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
  user: User;
}

const UpcomingSchedule = ({ shows = [], user }: Props) => {
  const classes = useStyles();

  const onAddToCalendarClicked = (show: Show) => {
    var cal = ics();
    if (!cal) {
      return;
    }
    const endDateTime = addMinutes(new Date(show.showtime), 60);
    cal.addEvent(
      `${user.username}: ${show.title}`,
      `Buy ticket, chat, and watch live at ${window.location.origin}/${user.urlSlug}`,
      'Live online show on GigWindow',
      show.showtime,
      endDateTime.toISOString()
    );
    cal.download(`${user.username}-${show.title}-calendar-event`, '.ics');
  };

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
              <TextButton onClick={() => onAddToCalendarClicked(show)}>
                Add to calendar
              </TextButton>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default React.memo(UpcomingSchedule);
