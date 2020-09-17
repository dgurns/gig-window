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
    marginBottom: spacing(2),
    width: 65,
  },
  githubLogoWrapper: {
    height: 26,
    marginBottom: spacing(1),
    marginRight: spacing(1),
  },
  githubLogo: {
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
      <Grid item container direction="row" alignItems="center">
        <Link
          href="https://github.com/dgurns/gig-window"
          target="_blank"
          className={classes.githubLogoWrapper}
        >
          <img
            src="/images/GitHub-Mark-120px-plus.png"
            alt="GitHub logo"
            className={classes.githubLogo}
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
      {User.isAdmin(currentUser) && (
        <Link component={RouterLink} to="/admin">
          Admin
        </Link>
      )}
    </Grid>
  );
};

export default Footer;
