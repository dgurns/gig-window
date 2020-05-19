import React from 'react';
import { format } from 'date-fns';
import { useQuery, gql } from '@apollo/client';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';
import DateTime from 'services/DateTime';

import NavSubheader from 'components/NavSubheader';
import CreateShowForm from 'components/CreateShowForm';

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
}));

const EditShows = () => {
  const classes = useStyles();
  const [currentUser] = useCurrentUser();

  const { loading, data, error, refetch } = useQuery(GET_SHOWS, {
    variables: { userId: currentUser?.id },
    skip: !currentUser,
  });
  const shows = data?.getShowsForUser || [];

  const renderShows = () => {
    if (loading) return <CircularProgress color="secondary" />;
    if (error)
      return <Typography color="error">Error fetching shows</Typography>;

    return shows.map(({ id, title, showtimeInUtc }: Show) => {
      return (
        <Grid container direction="column" key={id}>
          <Typography>{title}</Typography>
          <Typography color="secondary">
            {DateTime.formatUserReadableShowtime(showtimeInUtc)}
          </Typography>
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
          <CreateShowForm onSuccess={refetch} />
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
