import React, { useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useDialog from 'hooks/useDialog';

import PaymentForm from 'components/PaymentForm';
import MoneyInputField from 'components/MoneyInputField';

interface TipButtonProps {
  payee: {
    id: number;
    username: string;
  };
  show?: {
    id: number;
  };
}

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: 126,
  },
  tipAmount: {
    marginRight: spacing(1),
    width: 56,
  },
}));

const TipButton = ({ payee, show }: TipButtonProps) => {
  const classes = useStyles();

  const [PaymentDialog, setPaymentDialogIsVisible] = useDialog();
  const [tipAmount, setTipAmount] = useState('5');

  const onChangeTipAmount = (value: string) => {
    if (value === '' || value === '0') {
      return setTipAmount('');
    } else if (typeof parseInt(value) === 'number') {
      return setTipAmount(`${parseInt(value)}`);
    }
  };

  if (!payee.id || !payee.username) return null;

  return (
    <>
      <Grid className={classes.container}>
        <MoneyInputField
          className={classes.tipAmount}
          value={tipAmount}
          onChange={(event) => onChangeTipAmount(event.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => setPaymentDialogIsVisible(true)}
        >
          Tip
        </Button>
      </Grid>

      <PaymentDialog>
        <PaymentForm
          payee={payee}
          prefilledPaymentAmount={tipAmount}
          show={show}
        />
      </PaymentDialog>
    </>
  );
};

export default TipButton;
