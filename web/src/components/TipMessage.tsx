import React from 'react';
import classnames from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import { Grid, Link, Typography } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

import { Payment } from 'types';

const useStyles = makeStyles(({ spacing, palette }) => ({
  container: {
    marginBottom: spacing(1),
    marginTop: spacing(1),
  },
  userImage: {
    borderRadius: 20,
    height: 40,
    marginRight: spacing(1),
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    width: 40,
  },
  userImagePlaceholder: {
    backgroundColor: palette.background.default,
    borderRadius: 20,
    height: 40,
    marginRight: spacing(1),
    width: 40,
  },
  username: {
    color: green[500],
  },
  usernameLarge: {
    fontSize: '1.5rem',
  },
  tipMessage: {
    color: green[500],
    display: 'inline',
    flex: 1,
    marginTop: 6,
  },
}));

interface Props {
  payment: Payment;
  isLargeFontSize?: boolean;
}

const TipMessage = ({ payment, isLargeFontSize = false }: Props) => {
  const classes = useStyles();

  if (!payment) return null;

  const { user, amountInCents } = payment;

  return (
    <Grid container direction="row" className={classes.container}>
      <RouterLink to={user.urlSlug}>
        {user.profileImageUrl ? (
          <Grid
            item
            className={classes.userImage}
            style={{ backgroundImage: `url(${user.profileImageUrl})` }}
          />
        ) : (
          <Grid item className={classes.userImagePlaceholder} />
        )}
      </RouterLink>
      <Typography
        variant={isLargeFontSize ? 'h5' : 'body1'}
        className={classes.tipMessage}
      >
        <Link
          component={RouterLink}
          to={user.urlSlug}
          classes={{
            root: classnames(classes.username, {
              [classes.usernameLarge]: isLargeFontSize,
            }),
          }}
        >
          {user.username}
        </Link>{' '}
        tipped ${amountInCents / 100}!
      </Typography>
    </Grid>
  );
};

export default TipMessage;
