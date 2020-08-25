import React from 'react';

import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';
import User from 'services/User';

const useStyles = makeStyles(({ spacing }) => ({
  pageContent: {
    padding: spacing(2),
    paddingTop: spacing(4),
    width: '100%',
  },
}));

const Admin = () => {
  const classes = useStyles();

  const [currentUser] = useCurrentUser();
  const currentUserIsAdmin = User.isAdmin(currentUser);

  return (
    <Container maxWidth="md" disableGutters className={classes.pageContent}>
      {currentUserIsAdmin ? 'Admin UI' : 'User is not admin'}
    </Container>
  );
};

export default Admin;
