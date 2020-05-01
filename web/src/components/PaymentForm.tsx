import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import AuthForm from './AuthForm';

const useStyles = makeStyles((theme) => ({
  title: {
    margin: theme.spacing(3),
    marginBottom: 0,
  },
}));

const PaymentForm = () => {
  const classes = useStyles();

  return (
    <Grid container direction="column">
      <Typography variant="h4" className={classes.title}>
        Pay what you want
      </Typography>
      <AuthForm hideTitle={true} customSubmitLabel="Next" />
    </Grid>
  );
};

export default PaymentForm;
