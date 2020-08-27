import React from 'react';

import { Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';
import User from 'services/User';

import AdminSearchUsers from 'components/AdminSearchUsers';

const useStyles = makeStyles(({ spacing }) => ({
  pageContent: {
    padding: spacing(2),
    paddingTop: spacing(4),
    width: '100%',
  },
}));

const Admin = () => {
  const classes = useStyles();

  const [currentUser, { loading }] = useCurrentUser();
  const currentUserIsAdmin = User.isAdmin(currentUser);

  if (loading) {
    return null;
  }

  if (!currentUserIsAdmin) {
    return (
      <Container maxWidth="md" disableGutters className={classes.pageContent}>
        <Typography color="secondary">
          {currentUser
            ? 'Current user is not an admin'
            : 'Please log in as an admin'}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" disableGutters className={classes.pageContent}>
      <AdminSearchUsers />
    </Container>
  );
};

export default Admin;
