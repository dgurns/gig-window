import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Grid, Typography, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

interface EditPasswordFormProps {
  onSuccess?: () => void;
}

const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($password: String!) {
    updatePassword(password: $password) {
      id
    }
  }
`;

const useStyles = makeStyles(({ spacing }) => ({
  formField: {
    marginBottom: spacing(3),
    marginTop: spacing(1),
  },
  error: {
    marginBottom: spacing(3),
    textAlign: 'center',
  },
}));

const EditPasswordForm = ({ onSuccess }: EditPasswordFormProps) => {
  const classes = useStyles();
  const [updatePassword, { loading, data, error }] = useMutation(
    UPDATE_PASSWORD,
    {
      errorPolicy: 'all',
    }
  );

  const [updatedPassword, setUpdatedPassword] = useState('');
  const [
    updatedPasswordConfirmation,
    setUpdatedPasswordConfirmation,
  ] = useState('');
  const [localValidationError, setLocalValidationError] = useState('');

  useEffect(() => {
    if (data?.updatePassword.id) {
      window.alert('Password updated successfully');
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [data, onSuccess]);

  const onSaveClicked = () => {
    setLocalValidationError('');
    if (!updatedPassword || !updatedPasswordConfirmation) {
      return setLocalValidationError('Please fill out all the fields');
    } else if (updatedPassword !== updatedPasswordConfirmation) {
      return setLocalValidationError('Your passwords do not match');
    }
    if (
      window.confirm(
        'Are you absolutely sure you want to update your password?'
      )
    ) {
      updatePassword({ variables: { password: updatedPassword } });
    }
  };

  return (
    <Grid container item direction="column" xs={12}>
      <TextField
        value={updatedPassword}
        onChange={({ target: { value } }) => setUpdatedPassword(value)}
        variant="outlined"
        label="New password"
        type="password"
        className={classes.formField}
      />
      <TextField
        value={updatedPasswordConfirmation}
        onChange={({ target: { value } }) =>
          setUpdatedPasswordConfirmation(value)
        }
        variant="outlined"
        label="New password, one more time"
        type="password"
        className={classes.formField}
      />
      {localValidationError && (
        <Typography variant="body2" color="error" className={classes.error}>
          {localValidationError}
        </Typography>
      )}
      {!localValidationError && error && (
        <Typography variant="body2" color="error" className={classes.error}>
          {error.graphQLErrors.map(({ message }) => message)}
        </Typography>
      )}
      <Button
        onClick={onSaveClicked}
        color="primary"
        variant="contained"
        size="medium"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </Grid>
  );
};

export default EditPasswordForm;
