import React, { useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';
import DateTime from 'services/DateTime';

import NavSubheader from 'components/NavSubheader';
import CreateShowForm from 'components/CreateShowForm';
import TextButton from 'components/TextButton';

interface Show {
  id: number;
  title: string;
  showtimeInUtc: string;
}

const GET_SHOWS = gql`
  query GetShows($userId: Int!) {
    getShowsForUser(userId: $userId) {
      id
      title
      showtimeInUtc
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
}));

const EditShows = () => {
  const classes = useStyles();
  const [currentUser] = useCurrentUser();

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
    const confirm = window.confirm(
      'Are you sure you want to delete this show?'
    );
    if (confirm) deleteShow({ variables: { id } });
  };

  const renderShows = () => {
    if (getShowsQuery.loading) return <CircularProgress color="secondary" />;
    if (getShowsQuery.error)
      return <Typography color="error">Error fetching shows</Typography>;

    return shows.map(({ id, title, showtimeInUtc }: Show) => {
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
            {DateTime.formatUserReadableShowtime(showtimeInUtc)}
          </Typography>
          <Grid item container direction="row">
            <TextButton className={classes.showResultAction}>Edit</TextButton>
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
    </>
  );
};

export default EditShows;
