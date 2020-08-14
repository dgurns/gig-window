import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import useDialog from 'hooks/useDialog';
import { User, Show } from 'types';

import PaymentForm from 'components/PaymentForm';

interface BuyTicketButtonProps {
  payee: User;
  show?: Show;
  buttonText?: string;
  className?: string;
  loading?: boolean;
}

const BuyTicketButton = ({
  payee,
  show,
  buttonText,
  className,
  loading = false,
}: BuyTicketButtonProps) => {
  const [PaymentDialog, setPaymentDialogIsVisible] = useDialog();

  if (!payee.id || !payee.username || !payee.stripeConnectAccountId)
    return null;

  return (
    <>
      {loading ? (
        <CircularProgress color="secondary" size={30} />
      ) : (
        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={() => setPaymentDialogIsVisible()}
          className={className}
        >
          {buttonText ?? 'Buy ticket'}
        </Button>
      )}

      <PaymentDialog>
        <PaymentForm payee={payee} show={show} />
      </PaymentDialog>
    </>
  );
};

export default BuyTicketButton;
