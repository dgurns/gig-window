import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

interface EditPhotoForm {
  photoS3Key: string;
  onSuccess?: () => void;
}

const useStyles = makeStyles(({ spacing }) => ({
  formField: {
    marginBottom: spacing(3),
    marginTop: spacing(1),
  },
  chooseFileButton: {
    marginBottom: spacing(3),
  },
  cropper: {
    marginBottom: spacing(3),
    width: '100%',
  },
  error: {
    marginBottom: spacing(3),
    textAlign: 'center',
  },
}));

const EditPhotoForm = ({ photoS3Key, onSuccess }: EditPhotoForm) => {
  const classes = useStyles();

  // GraphQL mutation
  const loading = false;

  const [selectedFileObjectUrl, setSelectedFileObjectUrl] = useState('');
  const [crop, setCrop] = useState<ReactCrop.Crop>({
    aspect: 16 / 9,
    unit: '%',
    width: 80,
    x: 10,
    y: 10,
  });
  const [localValidationError, setLocalValidationError] = useState('');

  const onSaveClicked = () => {
    setLocalValidationError('');
    // validate
    // upload
  };

  const onFileChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return;
    }
    const selectedFile = event.target.files[0];
    const objectUrl = URL.createObjectURL(selectedFile);
    setSelectedFileObjectUrl(objectUrl);
  };

  return (
    <Grid container item direction="column" xs={12}>
      <input
        type="file"
        accept=".png,.jpeg,.jpg"
        onChange={onFileChanged}
        className={classes.chooseFileButton}
      />
      {selectedFileObjectUrl && (
        <ReactCrop
          src={selectedFileObjectUrl}
          crop={crop}
          onChange={(newCrop) => setCrop(newCrop)}
          keepSelection
          className={classes.cropper}
        />
      )}
      {localValidationError && (
        <Typography variant="body2" color="error" className={classes.error}>
          {localValidationError}
        </Typography>
      )}
      {/* {!localValidationError && error && (
        <Typography variant="body2" color="error" className={classes.error}>
          {error.graphQLErrors.map(({ message }) => message)}
        </Typography>
      )} */}
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

export default EditPhotoForm;
