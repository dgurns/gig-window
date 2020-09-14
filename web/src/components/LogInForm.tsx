import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import TextButton from 'components/TextButton';

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

const SEND_EMAIL_WITH_AUTO_LOGIN_URL = gql`
  mutation SendEmailWithAutoLoginUrl($email: String!) {
    sendEmailWithAutoLoginUrl(email: $email)
  }
`;

const useStyles = makeStyles(({ spacing }) => ({
  formField: {
    marginBottom: spacing(3),
  },
  error: {
    marginBottom: spacing(3),
    textAlign: 'center',
  },
  submitButton: {
    width: '100%',
  },
  forgotPassword: {
    marginTop: spacing(2),
  },
}));

const LogInForm = (props: LogInFormProps) => {
  const { onSuccess } = props;
  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [
    logIn,
    { loading: logInLoading, data: logInData, error: logInError },
  ] = useMutation(LOG_IN, {
    errorPolicy: 'all',
  });
  const [
    sendEmailWithAutoLoginUrl,
    { loading: sendEmailLoading, data: sendEmailData, error: sendEmailError },
  ] = useMutation(SEND_EMAIL_WITH_AUTO_LOGIN_URL, {
    errorPolicy: 'all',
  });

  const onLogInClicked = (event: React.FormEvent) => {
    event.preventDefault();
    logIn({ variables: { email, password } });
  };

  useEffect(() => {
    if (logInData && logInData.logIn?.id) {
      onSuccess ? onSuccess() : window.location.reload();
    }
  }, [logInData, onSuccess]);

  const onForgotPasswordClicked = (event: React.FormEvent) => {
    event.preventDefault();
    sendEmailWithAutoLoginUrl({ variables: { email } });
  };

  useEffect(() => {
    const recipientEmail = sendEmailData?.sendEmailWithAutoLoginUrl;
    if (recipientEmail) {
      window.alert(
        `Ok, we've sent an email to ${recipientEmail} with a link to log in. Please check your inbox (and spam folder just in case).`
      );
    }
  }, [sendEmailData]);

  return (
    <Grid container direction="column">
      <form onSubmit={onLogInClicked}>
        <TextField
          value={email}
          onChange={({ target: { value } }) => setEmail(value)}
          variant="outlined"
          label="Email"
          type="email"
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
        {logInError && (
          <Typography color="error" className={classes.error}>
            {logInError.graphQLErrors.map(({ message }) => message)}
          </Typography>
        )}
        {sendEmailError && (
          <Typography color="error" className={classes.error}>
            {sendEmailError.graphQLErrors.map(({ message }) => message)}
          </Typography>
        )}
        <Button
          color="primary"
          variant="contained"
          size="medium"
          disabled={logInLoading}
          type="submit"
          className={classes.submitButton}
        >
          {props.submitLabel}
        </Button>
      </form>

      <TextButton
        onClick={onForgotPasswordClicked}
        disabled={sendEmailLoading}
        className={classes.forgotPassword}
      >
        Forgot password?
      </TextButton>
    </Grid>
  );
};

LogInForm.defaultProps = {
  submitLabel: 'Log in',
};

export default LogInForm;
