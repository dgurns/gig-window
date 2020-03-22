import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.common.black,
    height: 56
  }
}));

const Header = () => {
  const classes = useStyles();

  return <Grid className={classes.container} />;
};

export default Header;
