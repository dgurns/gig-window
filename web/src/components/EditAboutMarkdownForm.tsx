import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Grid, Link, Typography, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import MarkdownRenderer from 'components/MarkdownRenderer';

const UPDATE_ABOUT_MARKDOWN = gql`
  mutation UpdateAboutMarkdown($aboutMarkdown: String!) {
    updateAboutMarkdown(aboutMarkdown: $aboutMarkdown) {
      id
    }
  }
`;

const useStyles = makeStyles(({ spacing, palette }) => ({
  description: {
    marginBottom: spacing(2),
  },
  formField: {
    marginTop: spacing(1),
  },
  markdownPreview: {
    border: `1px dashed ${palette.secondary.main}`,
    borderRadius: spacing(1),
    marginTop: spacing(2),
    padding: spacing(2),
  },
  submitButton: {
    marginTop: spacing(3),
  },
  error: {
    marginTop: spacing(3),
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

  const placeholderText = `Tell viewers about yourself...

**Bold**
_Italic_
[Link](https://your-website.com)
  `;

  return (
    <Grid container item direction="column" xs={12}>
      <Typography color="secondary" className={classes.description}>
        This appears on your profile below the video and chat. It uses{' '}
        <Link
          href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet"
          target="_blank"
        >
          Markdown formatting
        </Link>{' '}
        which enables you to add links, bold/italics, and more.
      </Typography>

      <TextField
        value={updatedAboutMarkdown}
        onChange={({ target: { value } }) => setUpdatedAboutMarkdown(value)}
        variant="outlined"
        multiline
        rows="10"
        placeholder={placeholderText}
        className={classes.formField}
      />

      <MarkdownRenderer
        className={classes.markdownPreview}
        rawMarkdown={updatedAboutMarkdown}
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
        className={classes.submitButton}
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
