import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Grid, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Url from 'services/Url';

import Subheader from './Subheader';

interface NavSubheaderProps {
  backUrl?: string;
  backLabel?: string;
  title: string;
}

const useStyles = makeStyles(({ spacing }) => ({
  navWrapper: {
    margin: `0 ${spacing(2)}px`,
  },
  navSpacer: {
    visibility: 'hidden',
  },
}));

const NavSubheader = (props: NavSubheaderProps) => {
  const {
    backUrl = Url.getParentRoute(window.location.pathname),
    backLabel = 'Back',
    title,
  } = props;

  const classes = useStyles();

  return (
    <Subheader>
      <Grid
        container
        direction="row"
        justify="space-between"
        className={classes.navWrapper}
      >
        <Link to={backUrl} component={RouterLink}>
          {backLabel}
        </Link>
        <Typography variant="body1">{title}</Typography>
        <span className={classes.navSpacer}>{backLabel}</span>
      </Grid>
    </Subheader>
  );
};

export default NavSubheader;
