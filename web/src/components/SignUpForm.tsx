import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { Paper, Grid, Typography, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const SIGN_UP = gql`
  mutation SignUp($email: String!, $username: String!, $password: String!) {
    signUp(data: { email: $email, username: $username, password: $password }) {
      id
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: 'column',
    padding: theme.spacing(3),
    width: 400,
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  formField: {
    marginBottom: theme.spacing(3),
  },
  error: {
    marginBottom: theme.spacing(3),
    textAlign: 'center',
  },
}));

const SignUpForm = () => {
  const classes = useStyles();
  const history = useHistory();
  const [signUp, { loading, data, error }] = useMutation(SIGN_UP, {
    errorPolicy: 'all',
  });

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [localValidationError, setLocalValidationError] = useState('');

  useEffect(() => {
    if (data?.signUp?.id) {
      window.location.reload();
    }
  }, [data, history]);

  const onSignUpClicked = () => {
    setLocalValidationError('');

    if (password !== passwordConfirmation) {
      return setLocalValidationError("Oops, your passwords don't match");
    }

    signUp({ variables: { email, username, password } });
  };

  return (
    <Paper>
      <Grid container className={classes.container}>
        <Typography variant="h4" className={classes.title}>
          Sign up
        </Typography>
        <TextField
          value={email}
          onChange={({ target: { value } }) => setEmail(value)}
          variant="outlined"
          label="Email"
          className={classes.formField}
        />
        <TextField
          value={username}
          onChange={({ target: { value } }) => setUsername(value)}
          variant="outlined"
          label="Username (or artist/venue name)"
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
        <TextField
          value={passwordConfirmation}
          onChange={({ target: { value } }) => setPasswordConfirmation(value)}
          variant="outlined"
          label="Password, one more time"
          type="password"
          className={classes.formField}
        />
        {localValidationError && (
          <Typography variant="body2" color="error" className={classes.error}>
            {localValidationError}
          </Typography>
        )}
        {error && (
          <Typography variant="body2" color="error" className={classes.error}>
            {error.graphQLErrors.map(({ message }) => message)}
          </Typography>
        )}
        <Button
          onClick={onSignUpClicked}
          color="primary"
          variant="contained"
          size="medium"
          disabled={loading}
        >
          Sign up
        </Button>
      </Grid>
    </Paper>
  );
};

export default SignUpForm;
