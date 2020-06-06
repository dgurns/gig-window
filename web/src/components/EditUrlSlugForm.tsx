import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { Grid, Typography, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

interface EditUrlSlugFormProps {
  urlSlug: string;
  onSuccess?: () => void;
}

const UPDATE_URL_SLUG = gql`
  mutation UpdateUrlSlug($urlSlug: String!) {
    updateUrlSlug(urlSlug: $urlSlug) {
      urlSlug
    }
  }
`;

const useStyles = makeStyles(({ spacing }) => ({
  formField: {
    marginBottom: spacing(3),
    marginTop: spacing(1),
  },
  urlWarning: {
    marginBottom: spacing(2),
  },
  error: {
    marginBottom: spacing(3),
    textAlign: 'center',
  },
}));

const EditUrlSlugForm = ({ urlSlug, onSuccess }: EditUrlSlugFormProps) => {
  const classes = useStyles();
  const history = useHistory();

  const [updateUrlSlug, { loading, data, error }] = useMutation(
    UPDATE_URL_SLUG,
    {
      errorPolicy: 'all',
    }
  );

  const [updatedUrlSlug, setUpdatedUrlSlug] = useState(urlSlug);
  const [localValidationError, setLocalValidationError] = useState('');

  useEffect(() => {
    const updatedUrlSlug = data?.updateUrlSlug.urlSlug;
    if (updatedUrlSlug) {
      if (onSuccess) {
        history.push(`/${updatedUrlSlug}/edit-profile`);
      }
    }
  }, [data, onSuccess]);

  const onSaveClicked = () => {
    setLocalValidationError('');
    if (!updatedUrlSlug) {
      return setLocalValidationError('Please enter a custom URL');
    } else if (updatedUrlSlug === urlSlug) {
      return setLocalValidationError('This is already your custom URL');
    }
    if (
      window.confirm(
        'Are you absolutely sure you want to change your custom URL? It will break any existing links to your page.'
      )
    ) {
      updateUrlSlug({ variables: { urlSlug: updatedUrlSlug } });
    }
  };

  return (
    <Grid container item direction="column" xs={12}>
      <Typography color="error" className={classes.urlWarning}>
        IMPORTANT: If you change your custom URL, it will break any existing
        links to your page.
      </Typography>
      <TextField
        value={updatedUrlSlug}
        onChange={({ target: { value } }) => setUpdatedUrlSlug(value)}
        variant="outlined"
        label="Custom URL"
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

export default EditUrlSlugForm;
