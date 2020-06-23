import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

import { User, Show } from 'types';

const useStyles = makeStyles(({ palette, spacing }) => ({
  liveLabel: {
    marginBottom: 6,
  },
  liveCircle: {
    backgroundColor: palette.error.main,
    borderRadius: 6,
    height: 11,
    marginRight: 5,
    width: 11,
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

interface LiveNowCardProps {
  user: User;
  show?: Show;
}

const LiveNowCard = ({ user, show }: LiveNowCardProps) => {
  const classes = useStyles();

  return (
    <>
      <Grid
        container
        direction="row"
        alignItems="center"
        className={classes.liveLabel}
      >
        <div className={classes.liveCircle} />
        <Typography color="error">Live</Typography>
      </Grid>
      <Link to={user.urlSlug} className={classes.cardLink}>
        <Card className={classes.card} elevation={3}>
          <CardMedia image={user.profileImageUrl} className={classes.image} />
          <Grid className={classes.textContent}>
            {show && <Typography variant="body1">{show.title}</Typography>}
            <Typography variant="body1" color="textSecondary">
              {user.username}
            </Typography>
          </Grid>
        </Card>
      </Link>
    </>
  );
};

export default LiveNowCard;
