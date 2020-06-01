import React from 'react';
import { Button } from '@material-ui/core';

import useDialog from 'hooks/useDialog';

import PaymentForm from 'components/PaymentForm';

interface BuyTicketButtonProps {
  payee: {
    id: number;
    username: string;
  };
  show?: {
    id: number;
  };
  buttonText?: string;
  className?: string;
}

const BuyTicketButton = ({
  payee,
  show,
  buttonText,
  className,
}: BuyTicketButtonProps) => {
  const [PaymentDialog, setPaymentDialogIsVisible] = useDialog();

  if (!payee.id || !payee.username) return null;

  return (
    <>
      <Button
        variant="contained"
        size="large"
        color="primary"
        onClick={() => setPaymentDialogIsVisible()}
        className={className}
      >
        {buttonText ?? 'Buy ticket'}
      </Button>

      <PaymentDialog>
        <PaymentForm payee={payee} show={show} />
      </PaymentDialog>
    </>
  );
};

export default BuyTicketButton;
