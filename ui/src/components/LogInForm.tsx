import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { Paper, Grid, Typography, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const LOG_IN = gql`
  mutation LogIn($email: String!, $password: String!) {
    logIn(data: { email: $email, password: $password }) {
      id
    }
  }
`;

const useStyles = makeStyles(theme => ({
  container: {
    flexDirection: 'column',
    padding: theme.spacing(3),
    width: 400
  },
  title: {
    marginBottom: theme.spacing(3)
  },
  formField: {
    marginBottom: theme.spacing(3)
  },
  error: {
    marginBottom: theme.spacing(3),
    textAlign: 'center'
  }
}));

const LogInForm = () => {
  const classes = useStyles();
  const history = useHistory();
  const [logIn, { loading, data, error }] = useMutation(LOG_IN, {
    errorPolicy: 'all'
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (data?.logIn?.id) {
      window.location.reload();
    }
  }, [data, history]);

  const onLogInClicked = () => {
    logIn({ variables: { email, password } });
  };

  return (
    <Paper>
      <Grid container className={classes.container}>
        <Typography variant="h4" className={classes.title}>
          Log in
        </Typography>
        <TextField
          value={email}
          onChange={({ target: { value } }) => setEmail(value)}
          variant="outlined"
          label="Email"
          className={classes.formField}
        />
        <TextField
          value={password}
          onChange={({ target: { value } }) => setPassword(value)}
          variant="outlined"
          label="Password"
          type="password"
          className={classes.formField}
        />
        {error && (
          <Typography variant="body2" color="error" className={classes.error}>
            {error.graphQLErrors.map(({ message }) => message)}
          </Typography>
        )}
        <Button
          onClick={onLogInClicked}
          color="primary"
          variant="contained"
          size="medium"
          disabled={loading}
        >
          Log in
        </Button>
      </Grid>
    </Paper>
  );
};

export default LogInForm;
