import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Subheader from 'components/Subheader';
import TextButton from 'components/TextButton';

const LOG_OUT = gql`
  mutation LogOut {
    logOut
  }
`;

const useStyles = makeStyles(theme => ({
  subheaderLink: {
    margin: `0 ${theme.spacing(3)}px`,
    [theme.breakpoints.down('xs')]: {
      margin: `${theme.spacing(1)}px ${theme.spacing(3)}px`
    }
  }
}));

const DashboardSubheader = () => {
  const classes = useStyles();
  const [logOut, { data }] = useMutation(LOG_OUT, {
    errorPolicy: 'all'
  });

  useEffect(() => {
    if (data?.logOut) {
      window.location.reload();
    }
  }, [data]);

  return (
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
      <TextButton onClick={() => logOut()} className={classes.subheaderLink}>
        Log out
      </TextButton>
    </Subheader>
  );
};

export default DashboardSubheader;
