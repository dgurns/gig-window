import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Grid, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

import useCurrentUser from 'hooks/useCurrentUser';
import User from 'services/User';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  container: {
    marginTop: spacing(2),
    paddingLeft: spacing(2),
    paddingRight: spacing(2),
    paddingBottom: spacing(6),
    [breakpoints.up('md')]: {
      paddingLeft: spacing(4),
      paddingRight: spacing(4),
    },
  },
  divider: {
    borderTop: `1px solid ${grey[400]}`,
    marginBottom: spacing(3),
    width: 65,
  },
  footerRow: {
    marginBottom: spacing(2),
  },
  logoWrapper: {
    height: 26,
    marginRight: spacing(1),
  },
  logo: {
    width: 26,
  },
}));

const Footer = () => {
  const classes = useStyles();

  const [currentUser] = useCurrentUser();

  return (
    <Grid
      container
      direction="column"
      alignItems="flex-start"
      className={classes.container}
    >
      <div className={classes.divider} />
      <Grid
        item
        container
        direction="row"
        alignItems="center"
        className={classes.footerRow}
      >
        <Link
          href="https://github.com/dgurns/gig-window"
          target="_blank"
          className={classes.logoWrapper}
        >
          <img
            src="/images/GitHub-Mark-120px-plus.png"
            alt="GitHub logo"
            className={classes.logo}
          />
        </Link>
        <Typography color="secondary">
          Visit{' '}
          <Link href="https://github.com/dgurns/gig-window" target="_blank">
            Github
          </Link>{' '}
          for source code and community
        </Typography>
      </Grid>
      <Grid
        item
        container
        direction="row"
        alignItems="center"
        className={classes.footerRow}
      >
        <Link
          href="https://twitter.com/danpgurney"
          target="_blank"
          className={classes.logoWrapper}
        >
          <img
            src="/images/TwitterLogo.png"
            alt="Twitter logo"
            className={classes.logo}
          />
        </Link>
        <Typography color="secondary">
          Read{' '}
          <Link href="https://twitter.com/danpgurney" target="_blank">
            tweets
          </Link>{' '}
          from the project's maintainer
        </Typography>
      </Grid>
      {User.isAdmin(currentUser) && (
        <Link component={RouterLink} to="/admin">
          Admin
        </Link>
      )}
    </Grid>
  );
};

export default Footer;
