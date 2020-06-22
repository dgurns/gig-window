import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

import { Show } from 'types';
import DateTime from 'services/DateTime';

const useStyles = makeStyles(({ spacing }) => ({
  showtime: {
    marginBottom: spacing(1),
  },
  cardLink: {
    textDecoration: 'none',
  },
  card: {
    alignItems: 'flex-start',
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    height: 88,
    minWidth: 280,
    padding: spacing(1),
    '&:hover': {
      backgroundColor: grey[100],
    },
  },
  image: {
    height: 72,
    marginRight: 10,
    minWidth: 109,
  },
  textContent: {
    height: 72,
    overflow: 'hidden',
  },
}));

interface UpcomingShowCardProps {
  show: Show;
}

const UpcomingShowCard = ({ show }: UpcomingShowCardProps) => {
  const classes = useStyles();

  return (
    <>
      <Typography color="secondary" className={classes.showtime}>
        {DateTime.formatUserReadableShowtime(show.showtime)}
      </Typography>
      <Link to={show.user.urlSlug} className={classes.cardLink}>
        <Card className={classes.card} elevation={3}>
          <CardMedia
            image={show.user.profileImageUrl}
            className={classes.image}
          />
          <Grid className={classes.textContent}>
            <Typography variant="body1">{show.title}</Typography>
            <Typography variant="body1" color="textSecondary">
              {show.user.username}
            </Typography>
          </Grid>
        </Card>
      </Link>
    </>
  );
};

export default UpcomingShowCard;
