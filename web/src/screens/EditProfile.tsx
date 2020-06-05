import React from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';
import useDialog from 'hooks/useDialog';

import NavSubheader from 'components/NavSubheader';
import TextButton from 'components/TextButton';

const useStyles = makeStyles(({ spacing }) => ({
  pageContent: {
    padding: spacing(2),
    paddingTop: spacing(4),
    width: '100%',
  },
  profileSection: {
    marginBottom: spacing(3),
  },
  editDialogTitle: {
    marginBottom: spacing(2),
  },
}));

const EditProfile = () => {
  const classes = useStyles();
  const [currentUser] = useCurrentUser();

  const [EditDialog, showEditDialog] = useDialog();

  if (!currentUser) return null;

  const { email, username, urlSlug, stripeAccountId } = currentUser;

  return (
    <>
      <NavSubheader title="Edit profile" />
      <Container maxWidth="md" disableGutters className={classes.pageContent}>
        <Grid className={classes.profileSection}>
          <Typography variant="h6">Photo</Typography>
          <Typography color="secondary">Nothing yet</Typography>
          <TextButton>Upload</TextButton>
        </Grid>
        <Grid className={classes.profileSection}>
          <Typography variant="h6">Email</Typography>
          <Typography>{email}</Typography>
          <TextButton>Edit</TextButton>
        </Grid>
        <Grid className={classes.profileSection}>
          <Typography variant="h6">Username</Typography>
          <Typography>{username}</Typography>
          <TextButton>Edit</TextButton>
        </Grid>
        <Grid className={classes.profileSection}>
          <Typography variant="h6">Custom URL</Typography>
          <Typography>
            {window.location.origin}/{urlSlug}
          </Typography>
          <TextButton>Edit</TextButton>
        </Grid>
        <Grid className={classes.profileSection}>
          <Typography variant="h6">Password</Typography>
          <TextButton>Change</TextButton>
        </Grid>
        {stripeAccountId && (
          <Grid className={classes.profileSection}>
            <Typography variant="h6">Linked Stripe account</Typography>
            <Typography>ID: {stripeAccountId}</Typography>
            <TextButton>Unlink</TextButton>
          </Grid>
        )}
      </Container>

      <EditDialog>
        <Typography variant="h6" className={classes.editDialogTitle}>
          Edit email address
        </Typography>
      </EditDialog>
    </>
  );
};

export default EditProfile;
