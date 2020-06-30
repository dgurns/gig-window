import React, { useState, useEffect, useRef } from 'react';
import { useMutation, gql } from '@apollo/client';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Image from 'services/Image';

const GENERATE_PRESIGNED_URL = gql`
  mutation GeneratePresignedUrl {
    generatePresignedImageUploadUrl
  }
`;

const UPDATE_PROFILE_IMAGE_URL = gql`
  mutation UpdateProfileImageUrl($profileImageUrl: String!) {
    updateProfileImageUrl(profileImageUrl: $profileImageUrl) {
      profileImageUrl
    }
  }
`;

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

interface EditProfileImageFormProps {
  onSuccess?: () => void;
}

const EditProfileImageForm = ({ onSuccess }: EditProfileImageFormProps) => {
  const classes = useStyles();
  const imageRef = useRef<HTMLImageElement | undefined>();

  const [
    generatePresignedUrl,
    generatePresignedUrlMutation,
  ] = useMutation(GENERATE_PRESIGNED_URL, { errorPolicy: 'all' });
  const [updateProfileImageUrl, updateProfileImageUrlMutation] = useMutation(
    UPDATE_PROFILE_IMAGE_URL,
    {
      errorPolicy: 'all',
    }
  );

  const [selectedFileObjectUrl, setSelectedFileObjectUrl] = useState('');
  const [crop, setCrop] = useState<ReactCrop.Crop>({
    aspect: Image.DEFAULT_IMAGE_ASPECT_RATIO,
    unit: '%',
    width: 80,
    x: 10,
    y: 10,
  });

  const [localValidationError, setLocalValidationError] = useState('');
  const [imageIsUploading, setImageIsUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (selectedFileObjectUrl) {
        URL.revokeObjectURL(selectedFileObjectUrl);
      }
    };
  }, [selectedFileObjectUrl]);

  const onSaveClicked = async () => {
    setLocalValidationError('');
    const imageElement = imageRef.current;
    if (!selectedFileObjectUrl || !imageElement) {
      return setLocalValidationError('Please choose a file');
    }
    const generatedImageBlob = await Image.generateImageBlobFromCrop(
      imageElement,
      crop
    );
    const presignedUrlResponse = await generatePresignedUrl();
    const presignedUrl =
      presignedUrlResponse.data?.generatePresignedImageUploadUrl;
    if (!presignedUrl) {
      return setLocalValidationError(
        'Error preparing image for upload. Please try again.'
      );
    }

    setImageIsUploading(true);
    try {
      await fetch(presignedUrl, {
        method: 'PUT',
        headers: {
          'Cache-Control': 'max-age=31536000', // 1 year
        },
        body: generatedImageBlob,
      });
      const newProfileImageUrl = presignedUrl.split('?')[0];
      await updateProfileImageUrl({
        variables: { profileImageUrl: newProfileImageUrl },
      });
      setImageIsUploading(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch {
      setImageIsUploading(false);
      return setLocalValidationError('Error uploading image. Please try again');
    }
  };

  const onFileChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return;
    }
    const selectedFile = event.target.files[0];
    const objectUrl = URL.createObjectURL(selectedFile);
    setSelectedFileObjectUrl(objectUrl);
  };

  const isLoading =
    generatePresignedUrlMutation.loading ||
    imageIsUploading ||
    updateProfileImageUrlMutation.loading;

  const shouldDisableButton = imageRef.current === undefined || isLoading;

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
          onImageLoaded={(image) => (imageRef.current = image)}
          keepSelection
          className={classes.cropper}
        />
      )}
      {localValidationError && (
        <Typography variant="body2" color="error" className={classes.error}>
          {localValidationError}
        </Typography>
      )}
      <Button
        onClick={onSaveClicked}
        color="primary"
        variant="contained"
        size="medium"
        disabled={shouldDisableButton}
      >
        {isLoading ? 'Saving...' : 'Save'}
      </Button>
    </Grid>
  );
};

export default EditProfileImageForm;
