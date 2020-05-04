import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MonetizationIcon from '@material-ui/icons/MonetizationOn';
import { makeStyles } from '@material-ui/core/styles';

import Subheader from 'components/Subheader';
import TextButton from 'components/TextButton';

const LOG_OUT = gql`
  mutation LogOut {
    logOut
  }
`;

const useStyles = makeStyles((theme) => ({
  container: {
    padding: `2px ${theme.spacing(3)}px 1px`,
  },
  subheaderLink: {
    margin: `0 ${theme.spacing(3)}px`,
    [theme.breakpoints.down('xs')]: {
      margin: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
    },
  },
  incomingPaymentsInfo: {
    marginBottom: 5,
  },
  monetizationIcon: {
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));

const DashboardSubheader = () => {
  const classes = useStyles();
  const [logOut, { data }] = useMutation(LOG_OUT, {
    errorPolicy: 'all',
  });

  useEffect(() => {
    if (data?.logOut) {
      window.location.reload();
    }
  }, [data]);

  return (
    <Subheader>
      <Grid
        container
        direction="column"
        alignItems="center"
        className={classes.container}
      >
        <Grid
          item
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Link to="/" component={RouterLink} className={classes.subheaderLink}>
            Edit profile
          </Link>
          <Link to="/" component={RouterLink} className={classes.subheaderLink}>
            Edit shows
          </Link>
          <Link to="/" component={RouterLink} className={classes.subheaderLink}>
            Transactions
          </Link>
          <TextButton
            onClick={() => logOut()}
            className={classes.subheaderLink}
          >
            Log out
          </TextButton>
        </Grid>
        <Grid
          item
          container
          direction="row"
          justify="center"
          alignItems="center"
          className={classes.incomingPaymentsInfo}
        >
          <MonetizationIcon className={classes.monetizationIcon} />
          <Typography color="secondary">
            All incoming payments will go directly to your Stripe account
          </Typography>
          <Link href="https://stripe.com" className={classes.subheaderLink}>
            Link Stripe account
          </Link>
        </Grid>
      </Grid>
    </Subheader>
  );
};

export default DashboardSubheader;
