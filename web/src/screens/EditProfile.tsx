import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';
import useDialog from 'hooks/useDialog';

import NavSubheader from 'components/NavSubheader';
import TextButton from 'components/TextButton';
import EditProfileImageForm from 'components/EditProfileImageForm';
import EditEmailForm from 'components/EditEmailForm';
import EditUsernameForm from 'components/EditUsernameForm';
import EditUrlSlugForm from 'components/EditUrlSlugForm';
import EditAboutMarkdownForm from 'components/EditAboutMarkdownForm';
import EditPasswordForm from 'components/EditPasswordForm';

const UNLINK_STRIPE_CONNECT_ACCOUNT = gql`
  mutation UnlinkStripeConnectAccount {
    unlinkStripeConnectAccount {
      id
    }
  }
`;

enum EditableField {
  ProfileImage = 'profileImage',
  Email = 'email',
  Username = 'username',
  UrlSlug = 'urlSlug',
  AboutMarkdown = 'aboutMarkdown',
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
  profileImage: {
    borderRadius: spacing(1),
    display: 'block',
    height: 80,
    marginBottom: 4,
    marginTop: 4,
  },
}));

const EditProfile = () => {
  const classes = useStyles();
  const [currentUser, { refetch: refetchCurrentUser }] = useCurrentUser();

  const [unlinkStripeConnectAccount, { loading, data, error }] = useMutation(
    UNLINK_STRIPE_CONNECT_ACCOUNT,
    {
      errorPolicy: 'all',
    }
  );

  useEffect(() => {
    if (data?.unlinkStripeConnectAccount.id) {
      window.alert(
        'Successfully unlinked Stripe account. You can always re-link it again in the future.'
      );
      refetchCurrentUser();
    } else if (error) {
      window.alert('Error unlinking Stripe account. Please try again');
    }
  }, [data, error, refetchCurrentUser]);

  const [EditDialog, showEditDialog] = useDialog();
  const [activeField, setActiveField] = useState<EditableField | null>();

  useEffect(() => {
    showEditDialog(Boolean(activeField));
  }, [activeField, showEditDialog]);

  if (!currentUser) return null;

  const {
    profileImageUrl,
    email,
    username,
    urlSlug,
    aboutMarkdown,
    stripeConnectAccountId,
  } = currentUser;

  const onEditSuccess = () => {
    refetchCurrentUser();
    setActiveField(null);
  };

  const onUnlinkStripeConnectAccount = () => {
    if (
      window.confirm(
        "Are you absolutely sure you want to unlink your Stripe account? You won't be able to play public shows or accept payments until you re-link it."
      )
    ) {
      unlinkStripeConnectAccount();
    }
  };

  const renderEditForm = () => {
    switch (activeField) {
      case EditableField.ProfileImage:
        return <EditProfileImageForm onSuccess={onEditSuccess} />;
      case EditableField.Email:
        return <EditEmailForm email={email} onSuccess={onEditSuccess} />;
      case EditableField.Username:
        return (
          <EditUsernameForm username={username} onSuccess={onEditSuccess} />
        );
      case EditableField.UrlSlug:
        return <EditUrlSlugForm urlSlug={urlSlug} onSuccess={onEditSuccess} />;
      case EditableField.AboutMarkdown:
        return (
          <EditAboutMarkdownForm
            aboutMarkdown={aboutMarkdown}
            onSuccess={onEditSuccess}
          />
        );
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
          <Typography variant="h6">Image</Typography>
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="User"
              className={classes.profileImage}
            />
          ) : (
            <Typography color="secondary">Nothing yet</Typography>
          )}
          <TextButton
            onClick={() => setActiveField(EditableField.ProfileImage)}
          >
            {profileImageUrl ? 'Edit' : 'Upload'}
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
          <Typography variant="h6">About</Typography>
          {!aboutMarkdown && (
            <Typography color="secondary">Nothing yet</Typography>
          )}
          <TextButton
            onClick={() => setActiveField(EditableField.AboutMarkdown)}
          >
            Edit
          </TextButton>
        </Grid>
        <Grid className={classes.profileSection}>
          <Typography variant="h6">Password</Typography>
          <TextButton onClick={() => setActiveField(EditableField.Password)}>
            Change
          </TextButton>
        </Grid>
        {stripeConnectAccountId && (
          <Grid className={classes.profileSection}>
            <Typography variant="h6">
              Linked Stripe account for accepting payments
            </Typography>
            <Typography>ID: {stripeConnectAccountId}</Typography>
            <TextButton
              disabled={loading}
              onClick={onUnlinkStripeConnectAccount}
            >
              Unlink
            </TextButton>
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
