import React from 'react';
import { Grid, Typography, Divider, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';

import AuthForm from './AuthForm';

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(1),
  },
  divider: {
    margin: `${theme.spacing(2)}px 0 10px`,
  },
  loading: {
    alignSelf: 'center',
    marginTop: theme.spacing(1),
  },
}));

const PaymentForm = () => {
  const classes = useStyles();

  const [currentUser, currentUserQuery] = useCurrentUser();

  const onAuthSuccess = () => {
    currentUserQuery.refetch();
  };

  const renderForm = () => {
    if (currentUserQuery.loading) {
      return <CircularProgress color="secondary" className={classes.loading} />;
    } else if (!currentUser) {
      return (
        <AuthForm
          hideTitle={true}
          customSubmitLabel="Next"
          onSuccess={onAuthSuccess}
        />
      );
    } else {
      return 'Payment form';
    }
  };

  return (
    <Grid container direction="column">
      <Typography variant="h4" className={classes.title}>
        Tip $3 to bingbong
      </Typography>
      <Typography color="secondary">
        80% goes to bingbong, 20% to the platform
      </Typography>
      <Divider color="secondary" className={classes.divider} />
      {renderForm()}
    </Grid>
  );
};

export default PaymentForm;
