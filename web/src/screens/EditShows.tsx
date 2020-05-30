import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';
import useDialog from 'hooks/useDialog';
import DateTime from 'services/DateTime';

import NavSubheader from 'components/NavSubheader';
import CreateShowForm from 'components/CreateShowForm';
import EditShowForm from 'components/EditShowForm';
import TextButton from 'components/TextButton';

interface Show {
  id: number;
  title?: string;
  showtime: string;
}

const GET_SHOWS = gql`
  query GetShows($userId: Int!) {
    getShowsForUser(userId: $userId) {
      id
      title
      showtime
    }
  }
`;

const DELETE_SHOW = gql`
  mutation DeleteShow($id: Int!) {
    deleteShow(data: { id: $id })
  }
`;

const useStyles = makeStyles(({ spacing }) => ({
  pageContent: {
    padding: spacing(2),
    paddingTop: spacing(4),
    width: '100%',
  },
  section: {
    marginBottom: spacing(4),
  },
  sectionHeading: {
    marginBottom: spacing(2),
  },
  showResult: {
    marginBottom: spacing(1),
  },
  showResultAction: {
    marginRight: spacing(1),
  },
  editShowDialogTitle: {
    marginBottom: spacing(2),
  },
}));

const EditShows = () => {
  const classes = useStyles();
  const [currentUser] = useCurrentUser();

  const [showToEdit, setShowToEdit] = useState<Show | null>(null);
  const [EditShowDialog, showEditShowDialog] = useDialog();

  const getShowsQuery = useQuery(GET_SHOWS, {
    variables: { userId: currentUser?.id },
    skip: !currentUser,
  });
  const shows = getShowsQuery.data?.getShowsForUser || [];
  const [deleteShow, deleteShowMutation] = useMutation(DELETE_SHOW, {
    errorPolicy: 'all',
  });

  useEffect(() => {
    if (deleteShowMutation.data?.deleteShow) {
      getShowsQuery.refetch();
    }
  }, [deleteShowMutation.data, getShowsQuery]);

  const onDeleteShow = (id: number) => {
    // TODO: Warn about deleting if this showId has payments attached
    const confirm = window.confirm(
      'Are you sure you want to delete this show?'
    );
    if (confirm) {
      return deleteShow({ variables: { id } });
    }
  };

  const renderShows = () => {
    if (getShowsQuery.loading) return <CircularProgress color="secondary" />;
    if (getShowsQuery.error)
      return <Typography color="error">Error fetching shows</Typography>;

    if (!shows.length) {
      return <Typography color="secondary">No upcoming shows</Typography>;
    }

    return shows.map((show: Show) => {
      const { id, title, showtime } = show;
      return (
        <Grid
          container
          direction="column"
          alignItems="flex-start"
          className={classes.showResult}
          key={id}
        >
          <Typography>{title}</Typography>
          <Typography color="secondary">
            {DateTime.formatUserReadableShowtime(showtime)}
          </Typography>
          <Grid item container direction="row">
            <TextButton
              onClick={() => {
                setShowToEdit(show);
                showEditShowDialog(true);
              }}
              className={classes.showResultAction}
            >
              Edit
            </TextButton>
            <TextButton
              onClick={() => onDeleteShow(id)}
              disabled={deleteShowMutation.loading}
            >
              Delete
            </TextButton>
          </Grid>
        </Grid>
      );
    });
  };

  return (
    <>
      <NavSubheader title="Edit shows" />
      <Container maxWidth="md" disableGutters className={classes.pageContent}>
        <Grid className={classes.section}>
          <Typography variant="h6" className={classes.sectionHeading}>
            Create a show
          </Typography>
          <CreateShowForm onSuccess={getShowsQuery.refetch} />
        </Grid>
        <Grid className={classes.section}>
          <Typography variant="h6" className={classes.sectionHeading}>
            Your upcoming shows
          </Typography>
          {renderShows()}
        </Grid>
      </Container>

      <EditShowDialog>
        <Typography variant="h6" className={classes.editShowDialogTitle}>
          Edit show
        </Typography>
        {showToEdit && (
          <EditShowForm
            show={showToEdit}
            onSuccess={() => {
              showEditShowDialog(false);
              getShowsQuery.refetch();
            }}
          />
        )}
      </EditShowDialog>
    </>
  );
};

export default EditShows;
