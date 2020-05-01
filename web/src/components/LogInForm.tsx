import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Grid, Typography, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

interface LogInFormProps {
  submitLabel?: string;
}

const LOG_IN = gql`
  mutation LogIn($email: String!, $password: String!) {
    logIn(data: { email: $email, password: $password }) {
      id
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  formField: {
    marginBottom: theme.spacing(3),
  },
  error: {
    marginBottom: theme.spacing(3),
    textAlign: 'center',
  },
}));

const LogInForm = (props: LogInFormProps) => {
  const classes = useStyles();
  const [logIn, { loading, data, error }] = useMutation(LOG_IN, {
    errorPolicy: 'all',
  });

  useEffect(() => {
    if (data && data.logIn?.id) {
      window.location.reload();
    }
  }, [data]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogInClicked = () => {
    logIn({ variables: { email, password } });
  };

  return (
    <Grid container direction="column">
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
        {props.submitLabel}
      </Button>
    </Grid>
  );
};

LogInForm.defaultProps = {
  submitLabel: 'Log in',
};

export default LogInForm;
