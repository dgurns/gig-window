import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Grid, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import useCurrentUser from 'hooks/useCurrentUser';
import useDialog from 'hooks/useDialog';
import LogInForm from 'components/LogInForm';
import SignUpForm from 'components/SignUpForm';
import TextButton from 'components/TextButton';

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
  },
  userLink: {
    color: theme.palette.common.white
  },
  userIcon: {
    marginLeft: theme.spacing(1)
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
        <RouterLink to="/">
          <img
            className={classes.logo}
            src="/images/cw_logo.png"
            alt="Concert Window logo"
          />
        </RouterLink>
        <Grid item>
          {userIsLoggedOut && (
            <>
              <TextButton
                className={classes.button}
                onClick={setLogInDialogIsVisible}
              >
                Log in
              </TextButton>
              <TextButton
                className={classes.button}
                onClick={setSignUpDialogIsVisible}
              >
                Sign up
              </TextButton>
            </>
          )}
          {currentUser && (
            <Link
              to={`/${currentUser.urlSlug}`}
              component={RouterLink}
              className={classes.userLink}
            >
              <Grid container direction="row" alignItems="center">
                <Typography>{currentUser.username}</Typography>
                <AccountCircleIcon
                  color="secondary"
                  fontSize="large"
                  className={classes.userIcon}
                />
              </Grid>
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
