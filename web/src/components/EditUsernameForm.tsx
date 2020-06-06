import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Grid, Typography, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

interface EditUsernameFormProps {
  username: string;
  onSuccess?: () => void;
}

const UPDATE_USERNAME = gql`
  mutation UpdateUsername($username: String!) {
    updateUsername(username: $username) {
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

const EditUsernameForm = ({ username, onSuccess }: EditUsernameFormProps) => {
  const classes = useStyles();
  const [updateUsername, { loading, data, error }] = useMutation(
    UPDATE_USERNAME,
    {
      errorPolicy: 'all',
    }
  );

  const [updatedUsername, setUpdatedUsername] = useState(username);
  const [localValidationError, setLocalValidationError] = useState('');

  useEffect(() => {
    if (data?.updateUsername.id) {
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [data, onSuccess]);

  const onSaveClicked = () => {
    setLocalValidationError('');
    if (!updatedUsername) {
      return setLocalValidationError('Please enter a username');
    } else if (updatedUsername === username) {
      return setLocalValidationError('This is already your username');
    }
    updateUsername({ variables: { username: updatedUsername } });
  };

  return (
    <Grid container item direction="column" xs={12}>
      <TextField
        value={updatedUsername}
        onChange={({ target: { value } }) => setUpdatedUsername(value)}
        variant="outlined"
        label="Username"
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

export default EditUsernameForm;
