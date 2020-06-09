import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';
import useDialog from 'hooks/useDialog';

import NavSubheader from 'components/NavSubheader';
import TextButton from 'components/TextButton';
import EditPhotoForm from 'components/EditPhotoForm';
import EditEmailForm from 'components/EditEmailForm';
import EditUsernameForm from 'components/EditUsernameForm';
import EditUrlSlugForm from 'components/EditUrlSlugForm';
import EditPasswordForm from 'components/EditPasswordForm';

enum EditableField {
  Photo = 'photo',
  Email = 'email',
  Username = 'username',
  UrlSlug = 'urlSlug',
  Password = 'password',
}

const useStyles = makeStyles(({ spacing }) => ({
  pageContent: {
    padding: spacing(2),
    paddingTop: spacing(4),
    width: '100%',
  },
  profileSection: {
    marginBottom: spacing(3),
  },
  userPhoto: {
    display: 'block',
    height: 72,
    marginBottom: 4,
    marginTop: 4,
  },
}));

const EditProfile = () => {
  const classes = useStyles();
  const [currentUser, currentUserQuery] = useCurrentUser();

  const [EditDialog, showEditDialog] = useDialog();
  const [activeField, setActiveField] = useState<EditableField | null>();

  useEffect(() => {
    showEditDialog(Boolean(activeField));
  }, [activeField, showEditDialog]);

  if (!currentUser) return null;

  const { photoS3Key, email, username, urlSlug, stripeAccountId } = currentUser;

  const onEditSuccess = () => {
    currentUserQuery.refetch();
    setActiveField(null);
  };

  const renderEditForm = () => {
    switch (activeField) {
      case EditableField.Photo:
        return (
          <EditPhotoForm photoS3Key={photoS3Key} onSuccess={onEditSuccess} />
        );
      case EditableField.Email:
        return <EditEmailForm email={email} onSuccess={onEditSuccess} />;
      case EditableField.Username:
        return (
          <EditUsernameForm username={username} onSuccess={onEditSuccess} />
        );
      case EditableField.UrlSlug:
        return <EditUrlSlugForm urlSlug={urlSlug} onSuccess={onEditSuccess} />;
      case EditableField.Password:
        return <EditPasswordForm onSuccess={onEditSuccess} />;
      default:
        return null;
    }
  };

  return (
    <>
      <NavSubheader title="Edit profile" />
      <Container maxWidth="md" disableGutters className={classes.pageContent}>
        <Grid className={classes.profileSection}>
          <Typography variant="h6">Photo</Typography>
          {photoS3Key ? (
            <img
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.daytonlocal.com%2Fimages%2Fmusic%2Fdayton-celtic-festival-gaelic-storm.jpg&f=1&nofb=1"
              alt="User"
              className={classes.userPhoto}
            />
          ) : (
            <Typography color="secondary">Nothing yet</Typography>
          )}
          <TextButton onClick={() => setActiveField(EditableField.Photo)}>
            {photoS3Key ? 'Edit' : 'Upload'}
          </TextButton>
        </Grid>
        <Grid className={classes.profileSection}>
          <Typography variant="h6">Email</Typography>
          <Typography>{email}</Typography>
          <TextButton onClick={() => setActiveField(EditableField.Email)}>
            Edit
          </TextButton>
        </Grid>
        <Grid className={classes.profileSection}>
          <Typography variant="h6">Username</Typography>
          <Typography>{username}</Typography>
          <TextButton onClick={() => setActiveField(EditableField.Username)}>
            Edit
          </TextButton>
        </Grid>
        <Grid className={classes.profileSection}>
          <Typography variant="h6">Custom URL</Typography>
          <Typography>
            {window.location.origin}/{urlSlug}
          </Typography>
          <TextButton onClick={() => setActiveField(EditableField.UrlSlug)}>
            Edit
          </TextButton>
        </Grid>
        <Grid className={classes.profileSection}>
          <Typography variant="h6">Password</Typography>
          <TextButton onClick={() => setActiveField(EditableField.Password)}>
            Change
          </TextButton>
        </Grid>
        {stripeAccountId && (
          <Grid className={classes.profileSection}>
            <Typography variant="h6">Linked Stripe account</Typography>
            <Typography>ID: {stripeAccountId}</Typography>
            <TextButton>Unlink</TextButton>
          </Grid>
        )}
      </Container>

      <EditDialog onClose={() => setActiveField(null)}>
        {renderEditForm()}
      </EditDialog>
    </>
  );
};

export default EditProfile;
