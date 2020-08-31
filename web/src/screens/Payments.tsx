import React, { useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import classnames from 'classnames';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';
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

const Payments = () => {
  const classes = useStyles();
  const [currentUser] = useCurrentUser();

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
    if (!payments.length) {
      return <Typography color="secondary">No payments yet</Typography>;
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
      <NavSubheader title="Payments" />
      <Container maxWidth="md" disableGutters className={classes.pageContent}>
        {currentUser?.isAllowedToStream && (
          <Grid className={classes.section}>
            <Typography variant="h6" className={classes.sectionHeading}>
              Payments to you
            </Typography>
            {currentUser?.stripeConnectAccountId ? (
              <Typography color="secondary">
                All incoming payments go directly to{' '}
                <Link href="https://dashboard.stripe.com" target="_blank">
                  your Stripe account
                </Link>
                . From there you can view accounting and customer details.{' '}
                <br />
                If any users want refunds, they should request them from their
                own Payments page on GigWindow. (Don't grant refunds via Stripe,
                as that won't refund the full amount, whereas the user's
                Payments page will.)
              </Typography>
            ) : (
              <Typography color="secondary">
                You need to link a Stripe account before you can accept
                payments. Stripe is a payment processor which enables fan
                payments to go directly to your bank account. It's free to set
                up.
              </Typography>
            )}
          </Grid>
        )}
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

export default Payments;
