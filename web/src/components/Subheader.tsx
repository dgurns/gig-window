import React from 'react';
import { Paper, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

interface SubheaderProps {
  children: React.ReactElement | React.ReactElement[];
}

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.common.white,
    minHeight: 30
  }
}));

const Subheader = (props: SubheaderProps) => {
  const classes = useStyles();

  return (
    <Paper elevation={1}>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.container}
      >
        {props.children}
      </Grid>
    </Paper>
  );
};

export default Subheader;
