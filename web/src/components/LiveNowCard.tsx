import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

import { User, Show } from 'types';

const useStyles = makeStyles(({ spacing }) => ({
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
    marginRight: spacing(1),
    minWidth: 109,
  },
  textContent: {
    height: 72,
    marginLeft: spacing(1),
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
      <Link to={user.urlSlug} className={classes.cardLink}>
        <Card className={classes.card} elevation={3}>
          {user.profileImageUrl && (
            <CardMedia image={user.profileImageUrl} className={classes.image} />
          )}
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
