import React from 'react';
import classnames from 'classnames';

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useUser from 'hooks/useUser';
import useShowsForUser from 'hooks/useShowsForUser';

const useStyles = makeStyles(({ palette, spacing }) => ({
  container: {
    backgroundColor: palette.common.black,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  curtainsBackground: {
    background: 'url("/images/curtains.jpg")',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    height: '100%',
    position: 'relative',
    width: '100%',
  },
}));

const EmbeddedPlayer = () => {
  const classes = useStyles();

  const urlSlug = window.location.pathname.split('/')[2];
  const [user, userQuery] = useUser({ urlSlug, subscribe: true });
  const [, showsQuery, activeShow] = useShowsForUser(user?.id);

  const content = (
    <Grid container xs={12} className={classes.curtainsBackground}></Grid>
  );

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={classes.container}
    >
      {content}
    </Grid>
  );
};

export default EmbeddedPlayer;
