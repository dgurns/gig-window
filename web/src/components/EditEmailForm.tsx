import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Grid, Typography, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

interface EditEmailFormProps {
  email: string;
  onSuccess?: () => void;
}

const UPDATE_EMAIL = gql`
  mutation UpdateEmail($email: String!) {
    updateEmail(email: $email) {
      id
    }
  }
`;

const useStyles = makeStyles(({ spacing }) => ({
  formField: {
    marginBottom: spacing(3),
    marginTop: spacing(1),
  },
  datePicker: {
    width: '100%',
  },
  error: {
    marginBottom: spacing(3),
    textAlign: 'center',
  },
}));

const EditEmailForm = ({ email, onSuccess }: EditEmailFormProps) => {
  const classes = useStyles();
  const [updateEmail, { loading, data, error }] = useMutation(UPDATE_EMAIL, {
    errorPolicy: 'all',
  });

  const [updatedEmail, setUpdatedEmail] = useState(email);
  const [localValidationError, setLocalValidationError] = useState('');

  useEffect(() => {
    if (data?.updateEmail.id) {
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [data, onSuccess]);

  const onSaveClicked = () => {
    setLocalValidationError('');
    if (!updatedEmail) {
      return setLocalValidationError('Please enter an email');
    } else if (updatedEmail === email) {
      return setLocalValidationError('This is already your email');
    }
    updateEmail({ variables: { email: updatedEmail } });
  };

  return (
    <Grid container item direction="column" xs={12}>
      <TextField
        value={updatedEmail}
        onChange={({ target: { value } }) => setUpdatedEmail(value)}
        variant="outlined"
        label="Email"
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

export default EditEmailForm;
