import React, { useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';
import TextButton from 'components/TextButton';

const SET_PUBLIC_MODE = gql`
  mutation SetPublicMode($publicMode: Boolean!) {
    setPublicMode(publicMode: $publicMode) {
      isInPublicMode
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  modeSwitcher: {
    backgroundColor: theme.palette.common.white,
    padding: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center',
    },
  },
  previewModeColorBand: {
    backgroundColor: theme.palette.warning.main,
    height: 3,
  },
  publicModeColorBand: {
    backgroundColor: theme.palette.success.main,
    height: 3,
  },
  switchStreamModeButton: {
    marginLeft: theme.spacing(2),
  },
}));

const DashboardModeSwitcher = () => {
  const classes = useStyles();

  const [currentUser] = useCurrentUser();
  const [setPublicMode, { data, loading }] = useMutation(SET_PUBLIC_MODE);

  const onTogglePublicMode = () => {
    setPublicMode({ variables: { publicMode: !Boolean(isInPublicMode) } });
  };

  const isInPublicMode =
    data?.setPublicMode.isInPublicMode ?? currentUser?.isInPublicMode;

  return (
    <Grid container direction="column">
      <Grid
        className={
          isInPublicMode
            ? classes.publicModeColorBand
            : classes.previewModeColorBand
        }
      />
      <Grid
        container
        justify="center"
        alignItems="center"
        className={classes.modeSwitcher}
      >
        {currentUser && (
          <>
            <Typography>
              {isInPublicMode
                ? "You're in public mode (everyone can see your stream)"
                : "You're in private mode (nobody can see your stream)"}
            </Typography>
            <TextButton
              onClick={onTogglePublicMode}
              className={classes.switchStreamModeButton}
              disabled={loading}
            >
              {`Switch to ${isInPublicMode ? 'private' : 'public'}`}
            </TextButton>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default DashboardModeSwitcher;
