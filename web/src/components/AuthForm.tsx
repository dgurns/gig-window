import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import SignUpForm from './SignUpForm';
import LogInForm from './LogInForm';
import TextButton from 'components/TextButton';

interface AuthFormProps {
  hideTitle?: boolean;
  showSignUpFirst?: boolean;
  customSubmitLabel?: string;
  onSuccess?: () => void;
}

const useStyles = makeStyles((theme) => ({
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
  const { hideTitle, customSubmitLabel, showSignUpFirst, onSuccess } = props;
  const classes = useStyles();

  const [showSignUpForm, setShowSignUpForm] = useState(showSignUpFirst);

  let title = showSignUpForm ? 'Sign up' : 'Log in';

  return (
    <>
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
        <SignUpForm submitLabel={customSubmitLabel} onSuccess={onSuccess} />
      ) : (
        <LogInForm submitLabel={customSubmitLabel} onSuccess={onSuccess} />
      )}
    </>
  );
};

AuthForm.defaultProps = {
  hideTitle: false,
  showSignUpFirst: true,
};

export default AuthForm;
