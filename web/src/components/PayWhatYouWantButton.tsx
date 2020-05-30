import React from 'react';
import { Button } from '@material-ui/core';

import useDialog from 'hooks/useDialog';

import PaymentForm from 'components/PaymentForm';

interface PayWhatYouWantButtonProps {
  payeeUserId: number;
  payeeUsername: string;
}

const PayWhatYouWantButton = ({
  payeeUserId,
  payeeUsername,
}: PayWhatYouWantButtonProps) => {
  const [PaymentDialog, setPaymentDialogIsVisible] = useDialog();

  if (!payeeUserId || !payeeUsername) return null;

  return (
    <>
      <Button
        variant="contained"
        size="large"
        color="primary"
        onClick={() => setPaymentDialogIsVisible()}
      >
        Buy ticket
      </Button>

      <PaymentDialog>
        <PaymentForm payeeUserId={payeeUserId} payeeUsername={payeeUsername} />
      </PaymentDialog>
    </>
  );
};

export default PayWhatYouWantButton;
