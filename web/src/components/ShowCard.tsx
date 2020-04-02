import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  cardLink: {
    textDecoration: 'none'
  },
  card: {
    alignItems: 'flex-start',
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    height: 88,
    minWidth: 280,
    padding: theme.spacing(1),
    '&:hover': {
      backgroundColor: grey[100]
    }
  },
  image: {
    height: 72,
    marginRight: 10,
    minWidth: 109
  },
  textContent: {
    height: 72,
    overflow: 'hidden'
  }
}));

const ShowCard = () => {
  const classes = useStyles();

  return (
    <Link to="/artist" className={classes.cardLink}>
      <Card className={classes.card} elevation={3}>
        <CardMedia
          image="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.daytonlocal.com%2Fimages%2Fmusic%2Fdayton-celtic-festival-gaelic-storm.jpg&f=1&nofb=1"
          className={classes.image}
        />
        <Grid className={classes.textContent}>
          <Typography variant="body1">My Great Tunes</Typography>
          <Typography variant="body1" color="textSecondary">
            Bartholomew Hornswoggle
          </Typography>
        </Grid>
      </Card>
    </Link>
  );
};

export default ShowCard;
