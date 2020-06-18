import React, { useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import classnames from 'classnames';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import usePayments from 'hooks/usePayments';
import DateTime from 'services/DateTime';

import NavSubheader from 'components/NavSubheader';
import TextButton from 'components/TextButton';

const REFUND_PAYMENT = gql`
  mutation RefundPayment($paymentId: Int!) {
    refundPayment(data: { paymentId: $paymentId }) {
      id
    }
  }
`;

const useStyles = makeStyles(({ spacing }) => ({
  pageContent: {
    padding: spacing(2),
    paddingTop: spacing(4),
    width: '100%',
  },
  section: {
    marginBottom: spacing(4),
  },
  sectionHeading: {
    marginBottom: spacing(2),
  },
  refundedPayment: {
    textDecoration: 'line-through',
  },
  refundButton: {
    marginLeft: spacing(1),
  },
}));

const Transactions = () => {
  const classes = useStyles();

  const { payments = [], paymentsQuery, refetchPayments } = usePayments();

  const [
    refundPayment,
    { data: refundData, loading: refundLoading, error: refundError },
  ] = useMutation(REFUND_PAYMENT, {
    errorPolicy: 'all',
  });

  useEffect(() => {
    if (refundData?.refundPayment) {
      window.alert('Payment has been refunded');
    }
    if (refundError) {
      window.alert('Error creating refund. Please try again');
    }
  }, [refundData, refundError]);

  const onRefundPayment = async (paymentId: number, payeeUsername: string) => {
    if (
      window.confirm(
        `Are you sure you want to refund this payment to ${payeeUsername}?`
      )
    ) {
      await refundPayment({ variables: { paymentId } });
      await refetchPayments();
    }
  };

  const renderPayments = () => {
    if (paymentsQuery.loading) {
      return <CircularProgress color="secondary" />;
    }
    if (paymentsQuery.error) {
      return (
        <Typography color="error">
          Error fetching payments. Please reload the page.
        </Typography>
      );
    }
    return payments.map(
      (
        { id, createdAt, amountInCents, isRefunded, payeeUser: { username } },
        index
      ) => {
        const date = DateTime.formatUserReadableDate(createdAt);
        const amount = (amountInCents / 100).toFixed(2);
        return (
          <Grid container direction="row" alignItems="center" key={index}>
            <Typography
              className={classnames({
                [classes.refundedPayment]: isRefunded,
              })}
            >
              {`${date} - $${amount} to ${username}`}
              {isRefunded && ' - Refunded'}
            </Typography>
            {!isRefunded && (
              <TextButton
                disabled={refundLoading}
                onClick={() => onRefundPayment(id, username)}
                className={classes.refundButton}
              >
                Refund
              </TextButton>
            )}
          </Grid>
        );
      }
    );
  };

  return (
    <>
      <NavSubheader title="Transactions" />
      <Container maxWidth="md" disableGutters className={classes.pageContent}>
        <Grid className={classes.section}>
          <Typography variant="h6" className={classes.sectionHeading}>
            Payments to you
          </Typography>
          <Typography color="secondary">
            All incoming payments go directly to{' '}
            <Link href="https://dashboard.stripe.com">your Stripe account</Link>
            . From there you can view accounting and customer details. <br />
            If any users want refunds, they should request them from their own
            Transactions page on Corona Window.
          </Typography>
        </Grid>
        <Grid className={classes.section}>
          <Typography variant="h6" className={classes.sectionHeading}>
            Your payments to others
          </Typography>
          {renderPayments()}
        </Grid>
      </Container>
    </>
  );
};

export default Transactions;
