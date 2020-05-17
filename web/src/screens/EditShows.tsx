import React from 'react';
import { Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import NavSubheader from 'components/NavSubheader';

const useStyles = makeStyles(({ spacing }) => ({
  pageContent: {
    padding: spacing(2),
    paddingTop: spacing(4),
    width: '100%',
  },
  sectionHeading: {
    marginBottom: 15,
  },
  showCards: {
    marginBottom: 35,
  },
}));

const EditShows = () => {
  const classes = useStyles();

  return (
    <>
      <NavSubheader title="Edit shows" />
      <Container maxWidth="md" disableGutters className={classes.pageContent}>
        <Typography variant="h6" className={classes.sectionHeading}>
          Create a show
        </Typography>
        <Typography variant="h6" className={classes.sectionHeading}>
          Your upcoming shows
        </Typography>
      </Container>
    </>
  );
};

export default EditShows;
