import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import useDialog from 'hooks/useDialog';

const GET_CURRENT_USER = gql`
  {
    getCurrentUser {
      id
    }
  }
`;

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.common.black,
    height: 56,
    padding: '0 10px 0 6px'
  },
  logo: {
    height: 50,
    marginTop: 3
  },
  button: {
    color: theme.palette.common.white
  }
}));

const Header = () => {
  const classes = useStyles();

  const { loading, data } = useQuery(GET_CURRENT_USER);
  const userIsLoggedOut = !loading && !data.getCurrentUser;
  const userIsLoggedIn = !loading && data.getCurrentUser;

  const [AuthDialog, setAuthDialogIsVisible] = useDialog();

  return (
    <>
      <Grid
        container
        className={classes.container}
        direction="row"
        alignItems="center"
        justify="space-between"
      >
        <Link to="/">
          <img
            className={classes.logo}
            src="/images/cw_logo.png"
            alt="Concert Window logo"
          />
        </Link>
        <Grid item>
          {userIsLoggedOut && (
            <>
              <Button
                className={classes.button}
                onClick={() => setAuthDialogIsVisible(true)}
              >
                Log in
              </Button>
              <Button className={classes.button}>Sign up</Button>
            </>
          )}
          {userIsLoggedIn && (
            <Link to={`/user/${data.getCurrentUser.id}`}>
              <AccountCircleIcon color="secondary" fontSize="large" />
            </Link>
          )}
        </Grid>
      </Grid>

      <AuthDialog />
    </>
  );
};

export default Header;
