import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';
import DateTime from 'services/DateTime';

import NavSubheader from 'components/NavSubheader';

interface Payment {
  id: number;
  createdAt: string;
  amountInCents: number;
  payeeUser: {
    username: string;
  };
}

const GET_PAYMENTS = gql`
  query GetPayments {
    getUserPayments {
      id
      createdAt
      amountInCents
      payeeUser {
        username
      }
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
}));

const Transactions = () => {
  const classes = useStyles();
  const [currentUser] = useCurrentUser();

  const getPaymentsQuery = useQuery(GET_PAYMENTS, {
    skip: !currentUser,
  });
  const payments: Payment[] = getPaymentsQuery.data?.getUserPayments || [];

  const renderPayments = () => {
    if (getPaymentsQuery.loading) {
      return <CircularProgress color="secondary" />;
    }
    if (getPaymentsQuery.error) {
      return (
        <Typography color="error">
          Error fetching payments. Please reload the page.
        </Typography>
      );
    }
    return payments.map(({ createdAt, amountInCents, payeeUser }, index) => {
      const date = DateTime.formatUserReadableDate(createdAt);
      const amount = (amountInCents / 100).toFixed(2);
      return (
        <Typography
          key={index}
        >{`${date} - $${amount} to ${payeeUser.username}`}</Typography>
      );
    });
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
            accounts.
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
