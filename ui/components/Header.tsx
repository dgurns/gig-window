import React from 'react';
import { Grid, Link, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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
  }
}));

const Header = () => {
  const classes = useStyles();

  return (
    <>
      <Grid
        container
        className={classes.container}
        direction="row"
        alignItems="center"
        justify="space-between"
      >
        <Link href="/">
          <img className={classes.logo} src="/images/cw_logo.png" />
        </Link>
        <Grid item>
          <Button className={classes.button}>Log in</Button>
          <Button className={classes.button}>Sign up</Button>
        </Grid>
      </Grid>
    </>
  );
};

export default Header;
