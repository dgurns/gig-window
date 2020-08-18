import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import classnames from 'classnames';
import { Grid, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import useCurrentUser from 'hooks/useCurrentUser';
import useDialog from 'hooks/useDialog';
import AuthForm from 'components/AuthForm';
import TextButton from 'components/TextButton';

const useStyles = makeStyles(({ palette, spacing }) => ({
  container: {
    backgroundColor: palette.common.black,
    height: 58,
    padding: `0 ${spacing(1)}px`,
  },
  logo: {
    marginLeft: 6,
  },
  button: {
    color: palette.common.white,
    marginLeft: spacing(2),
  },
  userLink: {
    color: palette.common.white,
  },
  userIcon: {
    marginLeft: spacing(1),
  },
  userImage: {
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    borderRadius: 20,
    height: 40,
    marginLeft: spacing(1),
    width: 40,
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

  const onAuthSuccess = () => {
    setAuthDialogIsVisible(false);
    currentUserQuery.refetch();
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
        <Link
          to="/"
          component={RouterLink}
          className={classnames(classes.logo, classes.userLink)}
        >
          <Typography>GigWindow</Typography>
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
                {currentUser.profileImageUrl ? (
                  <Grid
                    className={classes.userImage}
                    style={{
                      backgroundImage: `url(${currentUser.profileImageUrl})`,
                    }}
                  />
                ) : (
                  <AccountCircleIcon
                    color="secondary"
                    fontSize="large"
                    className={classes.userIcon}
                  />
                )}
              </Grid>
            </Link>
          )}
        </Grid>
      </Grid>

      <AuthDialog>
        <AuthForm showSignUpFirst={signUpIsActive} onSuccess={onAuthSuccess} />
      </AuthDialog>
    </>
  );
};

export default Header;
