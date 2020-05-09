import React from 'react';
import { Grid, Typography, Divider, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';

import MoneyInputField from './MoneyInputField';
import AuthForm from './AuthForm';
import PayWithCard from './PayWithCard';

interface PaymentFormProps {
  payeeUserId: number;
  prefilledPaymentAmount?: string;
}

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(1),
  },
  moneyInput: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  moneyInputField: {
    marginRight: theme.spacing(1),
    width: 80,
  },
  divider: {
    margin: `${theme.spacing(2)}px 0 10px`,
  },
  loading: {
    alignSelf: 'center',
    marginTop: theme.spacing(1),
  },
}));

const PaymentForm = (props: PaymentFormProps) => {
  const { payeeUserId, prefilledPaymentAmount } = props;
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
      return (
        <PayWithCard
          paymentAmount={3}
          payeeUserId={payeeUserId}
          onSuccess={() => {}}
        />
      );
    }
  };

  return (
    <Grid container direction="column">
      <Typography variant="h4" className={classes.title}>
        {prefilledPaymentAmount
          ? `Tip $${prefilledPaymentAmount} to bingbong`
          : 'Name your price'}
      </Typography>
      {!prefilledPaymentAmount && (
        <Grid
          item
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-end"
          className={classes.moneyInput}
        >
          <MoneyInputField
            autoFocus={true}
            className={classes.moneyInputField}
            defaultValue={prefilledPaymentAmount}
          />
          <Typography variant="body2" color="secondary">
            ($1 or more)
          </Typography>
        </Grid>
      )}
      <Typography color="secondary">
        80% goes to bingbong, 20% to the platform after payment processing fees
      </Typography>
      <Divider color="secondary" className={classes.divider} />
      {renderForm()}
    </Grid>
  );
};

export default PaymentForm;
