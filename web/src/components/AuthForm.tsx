import React, { useState } from 'react';
import { Paper, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import SignUpForm from './SignUpForm';
import LogInForm from './LogInForm';

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
    marginBottom: theme.spacing(3),
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
        <Typography color="secondary">
          {showSignUpForm
            ? 'Already have an account? Log in'
            : 'Need an account? Sign up'}
        </Typography>
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
