import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
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
    padding: '0 12px',
  },
  logoLinkWrapper: {
    height: 33,
    marginLeft: 3,
    marginTop: 1,
  },
  logo: {
    height: 33,
  },
  button: {
    color: palette.common.white,
    marginLeft: spacing(2),
  },
  userLink: {
    color: palette.common.white,
  },
  githubLogoWrapper: {
    height: 26,
    marginLeft: spacing(2),
  },
  githubLogo: {
    width: 26,
  },
  userIcon: {
    marginLeft: spacing(1),
  },
  userImage: {
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    borderRadius: 18,
    height: 36,
    marginLeft: spacing(1),
    width: 36,
  },
}));

const Header = () => {
  const classes = useStyles();

  const { pathname } = useLocation();
  useEffect(() => {
    if (window.scrollY > 0) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  const [currentUser, { loading, refetch }] = useCurrentUser();
  const userIsLoggedOut = !currentUser && !loading;

  const [AuthDialog, setAuthDialogIsVisible] = useDialog();
  const [signUpIsActive, setSignUpIsActive] = useState(true);

  const showAuthDialog = (shouldShowSignUp: boolean = true) => {
    setSignUpIsActive(shouldShowSignUp);
    setAuthDialogIsVisible();
  };

  const onAuthSuccess = () => {
    setAuthDialogIsVisible(false);
    if (refetch) {
      refetch();
    }
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
        <Link to="/" component={RouterLink} className={classes.logoLinkWrapper}>
          <img
            src="/images/GigWindowLogo-Light-120.png"
            alt="GigWindow Logo"
            className={classes.logo}
          />
        </Link>
        <Grid item>
          {userIsLoggedOut && (
            <Grid container direction="row" alignItems="center">
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
              <Link
                href="https://github.com/dgurns/gig-window"
                target="_blank"
                className={classes.githubLogoWrapper}
              >
                <img
                  src="/images/GitHub-Mark-Light-120px-plus.png"
                  alt="GitHub logo"
                  className={classes.githubLogo}
                />
              </Link>
            </Grid>
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

export default React.memo(Header);
