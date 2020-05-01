import React, { useState } from 'react';
import { Paper, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import SignUpForm from './SignUpForm';
import LogInForm from './LogInForm';
import TextButton from 'components/TextButton';

interface AuthFormProps {
  hideTitle?: boolean;
  showSignUpFirst?: boolean;
  customSubmitLabel?: string;
}

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: 'column',
    padding: theme.spacing(3),
    width: 400,
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  switchModeText: {
    marginBottom: theme.spacing(1),
  },
  switchModeButton: {
    paddingBottom: 3,
  },
}));

const AuthForm = (props: AuthFormProps) => {
  const { hideTitle, customSubmitLabel, showSignUpFirst } = props;
  const classes = useStyles();

  const [showSignUpForm, setShowSignUpForm] = useState(showSignUpFirst);

  let title = showSignUpForm ? 'Sign up' : 'Log in';

  return (
    <Paper>
      <Grid container className={classes.container}>
        {!hideTitle && (
          <Typography variant="h4" className={classes.title}>
            {title}
          </Typography>
        )}
        {showSignUpForm ? (
          <Typography color="secondary" className={classes.switchModeText}>
            Already have an account?{' '}
            <TextButton
              onClick={() => setShowSignUpForm(false)}
              className={classes.switchModeButton}
            >
              Log in
            </TextButton>
          </Typography>
        ) : (
          <Typography color="secondary" className={classes.switchModeText}>
            Need an account?{' '}
            <TextButton
              onClick={() => setShowSignUpForm(true)}
              className={classes.switchModeButton}
            >
              Sign up
            </TextButton>
          </Typography>
        )}
        {showSignUpForm ? (
          <SignUpForm submitLabel={customSubmitLabel} />
        ) : (
          <LogInForm submitLabel={customSubmitLabel} />
        )}
      </Grid>
    </Paper>
  );
};

AuthForm.defaultProps = {
  hideTitle: false,
  showSignUpFirst: true,
};

export default AuthForm;
