import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import useCurrentUser from 'hooks/useCurrentUser';
import useDialog from 'hooks/useDialog';
import LogInForm from 'components/LogInForm';
import SignUpForm from 'components/SignUpForm';

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
    color: theme.palette.common.white,
    '&:hover': {
      textDecoration: 'none'
    }
  }
}));

const Header = () => {
  const classes = useStyles();

  const [currentUser, currentUserLoading] = useCurrentUser();
  const userIsLoggedOut = !currentUser && !currentUserLoading;

  const [LogInDialog, setLogInDialogIsVisible] = useDialog();
  const [SignUpDialog, setSignUpDialogIsVisible] = useDialog();

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
                onClick={setLogInDialogIsVisible}
              >
                Log in
              </Button>
              <Button
                className={classes.button}
                onClick={setSignUpDialogIsVisible}
              >
                Sign up
              </Button>
            </>
          )}
          {currentUser && (
            <Link to={'/user'}>
              <AccountCircleIcon color="secondary" fontSize="large" />
            </Link>
          )}
        </Grid>
      </Grid>

      <LogInDialog>
        <LogInForm />
      </LogInDialog>
      <SignUpDialog>
        <SignUpForm />
      </SignUpDialog>
    </>
  );
};

export default Header;
