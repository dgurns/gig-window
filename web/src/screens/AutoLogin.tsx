import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const LOG_IN_WITH_AUTO_LOGIN_TOKEN = gql`
  mutation LogInWithAutoLoginToken($token: String!) {
    logInWithAutoLoginToken(token: $token) {
      urlSlug
    }
  }
`;

const useStyles = makeStyles(({ spacing }) => ({
  pageContent: {
    padding: spacing(2),
    paddingTop: spacing(4),
    width: '100%',
  },
}));

interface RouteParams {
  autoLoginToken: string;
}

const AutoLogin = () => {
  const classes = useStyles();
  const { autoLoginToken } = useParams<RouteParams>();

  const [
    logInWithAutoLoginToken,
    { loading, data, error },
  ] = useMutation(LOG_IN_WITH_AUTO_LOGIN_TOKEN, { errorPolicy: 'all' });

  useEffect(() => {
    logInWithAutoLoginToken({ variables: { token: autoLoginToken } });
  }, [logInWithAutoLoginToken, autoLoginToken]);

  useEffect(() => {
    const loggedInUserUrlSlug = data?.logInWithAutoLoginToken?.urlSlug;
    if (loggedInUserUrlSlug) {
      window.location.href = `/${loggedInUserUrlSlug}/edit-profile`;
    }
  }, [data]);

  const message = useMemo(() => {
    if (loading) {
      return <Typography color="secondary">Logging in...</Typography>;
    } else if (error) {
      return (
        <Typography color="error">
          {error.graphQLErrors.map(({ message }) => message)}
        </Typography>
      );
    }
    return null;
  }, [loading, error]);

  return (
    <Container maxWidth="md" disableGutters className={classes.pageContent}>
      <>{message}</>
    </Container>
  );
};

export default AutoLogin;
