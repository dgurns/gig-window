import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Grid, Typography, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const UPDATE_ABOUT_MARKDOWN = gql`
  mutation UpdateAboutMarkdown($aboutMarkdown: String!) {
    updateAboutMarkdown(aboutMarkdown: $aboutMarkdown) {
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

interface Props {
  aboutMarkdown: string;
  onSuccess?: () => void;
}

const EditAboutMarkdownForm = ({ aboutMarkdown, onSuccess }: Props) => {
  const classes = useStyles();
  const [updateAboutMarkdown, { loading, data, error }] = useMutation(
    UPDATE_ABOUT_MARKDOWN,
    {
      errorPolicy: 'all',
    }
  );

  const [updatedAboutMarkdown, setUpdatedAboutMarkdown] = useState(
    aboutMarkdown
  );
  const [localValidationError, setLocalValidationError] = useState('');

  useEffect(() => {
    if (data?.updateAboutMarkdown.id) {
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [data, onSuccess]);

  const onSaveClicked = () => {
    setLocalValidationError('');
    if (updatedAboutMarkdown === aboutMarkdown) {
      return setLocalValidationError(
        'This is the same as your existing About text'
      );
    }
    updateAboutMarkdown({ variables: { aboutMarkdown: updatedAboutMarkdown } });
  };

  return (
    <Grid container item direction="column" xs={12}>
      <TextField
        value={updatedAboutMarkdown}
        onChange={({ target: { value } }) => setUpdatedAboutMarkdown(value)}
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

export default EditAboutMarkdownForm;
