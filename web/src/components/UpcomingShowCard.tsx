import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

import { Show } from 'types';
import DateTime from 'services/DateTime';

const useStyles = makeStyles(({ spacing }) => ({
  showtime: {
    marginBottom: 6,
  },
  cardLink: {
    textDecoration: 'none',
  },
  card: {
    alignItems: 'flex-start',
    borderRadius: spacing(1),
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
    borderRadius: spacing(1),
    height: 72,
    marginRight: spacing(1),
    minWidth: 109,
  },
  textContent: {
    height: 72,
    marginLeft: spacing(1),
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
          {show.user.profileImageUrl && (
            <CardMedia
              image={show.user.profileImageUrl}
              className={classes.image}
            />
          )}
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
