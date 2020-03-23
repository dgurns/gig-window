import React from 'react';
import { Card, CardMedia, CardContent, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  card: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    height: 87,
    minWidth: 280,
    padding: 8,
    '&:hover': {
      backgroundColor: grey[100]
    }
  },
  image: {
    height: 60,
    width: 'auto'
  }
}));

const ShowCard = () => {
  const classes = useStyles();

  return (
    <Link href="/about">
      <Card raised className={classes.card}>
        <CardMedia
          component="img"
          src="/images/cw_logo.png"
          className={classes.image}
        />
        <CardContent>Hi</CardContent>
      </Card>
    </Link>
  );
};

export default ShowCard;
