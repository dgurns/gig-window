import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Grid, Typography, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

interface SignUpFormProps {
  submitLabel?: string;
  onSuccess?: () => void;
}

const SIGN_UP = gql`
  mutation SignUp($email: String!, $username: String!, $password: String!) {
    signUp(data: { email: $email, username: $username, password: $password }) {
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

const SignUpForm = (props: SignUpFormProps) => {
  const { onSuccess } = props;

  const classes = useStyles();
  const [signUp, { loading, data, error }] = useMutation(SIGN_UP, {
    errorPolicy: 'all',
  });

  useEffect(() => {
    if (data && data.signUp.id) {
      onSuccess ? onSuccess() : window.location.reload();
    }
  }, [data, onSuccess]);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [localValidationError, setLocalValidationError] = useState('');

  const onSignUpClicked = () => {
    setLocalValidationError('');

    if (password !== passwordConfirmation) {
      return setLocalValidationError("Oops, your passwords don't match");
    }

    signUp({ variables: { email, username, password } });
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
        {props.submitLabel}
      </Button>
    </Grid>
  );
};

SignUpForm.defaultProps = {
  submitLabel: 'Sign up',
};

export default SignUpForm;
