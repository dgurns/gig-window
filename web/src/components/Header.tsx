import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Grid, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import useCurrentUser from 'hooks/useCurrentUser';
import useDialog from 'hooks/useDialog';
import AuthForm from 'components/AuthForm';
import TextButton from 'components/TextButton';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.common.black,
    height: 56,
    padding: '0 10px',
  },
  logo: {
    height: 50,
    marginTop: 3,
  },
  button: {
    color: theme.palette.common.white,
  },
  userLink: {
    color: theme.palette.common.white,
  },
  userIcon: {
    marginLeft: theme.spacing(1),
  },
}));

const Header = () => {
  const classes = useStyles();

  const [currentUser, currentUserQuery] = useCurrentUser();
  const userIsLoggedOut = !currentUser && !currentUserQuery.loading;

  const [AuthDialog, setAuthDialogIsVisible] = useDialog();
  const [signUpIsActive, setSignUpIsActive] = useState(true);

  const showAuthDialog = (shouldShowSignUp: boolean = true) => {
    setSignUpIsActive(shouldShowSignUp);
    setAuthDialogIsVisible();
  };

  return (
    <>
      <Grid
        container
        className={classes.container}
        direction="row"
        alignItems="center"
        justify="space-between"
      >
        <Link to="/" component={RouterLink} className={classes.userLink}>
          <Typography>Home</Typography>
        </Link>
        <Grid item>
          {userIsLoggedOut && (
            <>
              <TextButton
                className={classes.button}
                onClick={() => showAuthDialog(false)}
              >
                Log in
              </TextButton>
              <TextButton
                className={classes.button}
                onClick={() => showAuthDialog(true)}
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

      <AuthDialog>
        <AuthForm showSignUpFirst={signUpIsActive} />
      </AuthDialog>
    </>
  );
};

export default Header;
