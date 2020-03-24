import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Link, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Subheader from 'components/Subheader';

const useStyles = makeStyles(theme => ({
  pageContent: {
    paddingTop: 35,
    width: '100%'
  },
  subheaderLink: {
    margin: '0 20px',
    [theme.breakpoints.down('xs')]: {
      margin: '10px 20px'
    }
  }
}));

const Artist = () => {
  const classes = useStyles();

  return (
    <>
      <Subheader>
        <Link
          to="/"
          variant="body1"
          component={RouterLink}
          className={classes.subheaderLink}
        >
          Edit profile
        </Link>
        <Link
          to="/"
          variant="body1"
          component={RouterLink}
          className={classes.subheaderLink}
        >
          Schedule show
        </Link>
        <Link
          to="/"
          variant="body1"
          component={RouterLink}
          className={classes.subheaderLink}
        >
          Edit shows
        </Link>
        <Link
          to="/"
          variant="body1"
          component={RouterLink}
          className={classes.subheaderLink}
        >
          Transactions
        </Link>
      </Subheader>
      <Container disableGutters maxWidth={false}>
        Artist
      </Container>
    </>
  );
};

export default Artist;
