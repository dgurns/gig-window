import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

interface LogInFormProps {
  submitLabel?: string;
  onSuccess?: () => void;
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
  submitButton: {
    width: '100%',
  },
}));

const LogInForm = (props: LogInFormProps) => {
  const { onSuccess } = props;

  const classes = useStyles();
  const [logIn, { loading, data, error }] = useMutation(LOG_IN, {
    errorPolicy: 'all',
  });

  useEffect(() => {
    if (data && data.logIn?.id) {
      onSuccess ? onSuccess() : window.location.reload();
    }
  }, [data, onSuccess]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogInClicked = (event: React.FormEvent) => {
    event.preventDefault();
    logIn({ variables: { email, password } });
  };

  return (
    <Grid container direction="column">
      <form onSubmit={onLogInClicked}>
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
          color="primary"
          variant="contained"
          size="medium"
          disabled={loading}
          type="submit"
          className={classes.submitButton}
        >
          {props.submitLabel}
        </Button>
      </form>
    </Grid>
  );
};

LogInForm.defaultProps = {
  submitLabel: 'Log in',
};

export default LogInForm;
