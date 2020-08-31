import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';

import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';

import Subheader from 'components/Subheader';
import TextButton from 'components/TextButton';

const LOG_OUT = gql`
  mutation LogOut {
    logOut
  }
`;

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  container: {
    padding: `4px ${spacing(3)}px`,
  },
  subheaderLink: {
    margin: `0 ${spacing(3)}px`,
    [breakpoints.down('xs')]: {
      margin: `${spacing(1)}px ${spacing(3)}px`,
    },
  },
}));

const DashboardSubheader = () => {
  const classes = useStyles();
  const { pathname } = useLocation();

  const [currentUser] = useCurrentUser();
  const { isAllowedToStream } = currentUser ?? {};

  const [logOut, { data }] = useMutation(LOG_OUT, {
    errorPolicy: 'all',
  });

  useEffect(() => {
    if (data?.logOut) {
      window.location.reload();
    }
  }, [data]);

  return (
    <Subheader>
      <Grid
        container
        direction="column"
        alignItems="center"
        className={classes.container}
      >
        <Grid
          item
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Link
            to={`${pathname}/edit-profile`}
            component={RouterLink}
            className={classes.subheaderLink}
          >
            Edit profile
          </Link>
          {isAllowedToStream && (
            <Link
              to={`${pathname}/edit-shows`}
              component={RouterLink}
              className={classes.subheaderLink}
            >
              Edit shows
            </Link>
          )}
          <Link
            to={`${pathname}/payments`}
            component={RouterLink}
            className={classes.subheaderLink}
          >
            Payments
          </Link>
          <TextButton
            onClick={() => logOut()}
            classes={{ root: classes.subheaderLink }}
          >
            Log out
          </TextButton>
        </Grid>
      </Grid>
    </Subheader>
  );
};

export default React.memo(DashboardSubheader);
