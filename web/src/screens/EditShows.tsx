import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Grid, Link, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Url from 'services/Url';
import Subheader from 'components/Subheader';

const useStyles = makeStyles(({ spacing }) => ({
  navWrapper: {
    margin: `0 ${spacing(2)}px`,
  },
  navSpacer: {
    width: 34,
  },
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
      <Subheader>
        <Grid
          container
          direction="row"
          justify="space-between"
          className={classes.navWrapper}
        >
          <Link
            to={Url.getParentRoute(window.location.pathname)}
            component={RouterLink}
          >
            Back
          </Link>
          <Typography variant="body1">Edit Shows</Typography>
          <span className={classes.navSpacer} />
        </Grid>
      </Subheader>
      <Container maxWidth="md" disableGutters className={classes.pageContent}>
        <Typography variant="h6" className={classes.sectionHeading}>
          Create Show
        </Typography>
      </Container>
    </>
  );
};

export default EditShows;
