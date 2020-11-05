import React, { useMemo } from 'react';

import { Grid, Typography, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useUser from 'hooks/useUser';
import useShowsForUser from 'hooks/useShowsForUser';
import DateTime from 'services/DateTime';
import Image from 'services/Image';

const useStyles = makeStyles(({ palette, spacing, breakpoints }) => ({
  container: {
    backgroundColor: palette.common.black,
    background: 'url("/images/curtains.jpg")',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    bottom: 0,
    color: palette.common.white,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  secondaryContent: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    padding: spacing(4),
    position: 'absolute',
    right: 0,
    [breakpoints.down('sm')]: {
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
  },
  userInfoContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    [breakpoints.down('xs')]: {
      marginBottom: spacing(2),
    },
  },
  userImage: {
    height: 80,
    marginRight: spacing(2),
    width: 80 * Image.DEFAULT_IMAGE_ASPECT_RATIO,
  },
  userText: {
    flexDirection: 'column',
  },
}));

const EmbeddedPlayer = () => {
  const classes = useStyles();

  const urlSlug = window.location.pathname.split('/')[2];
  const [user, userQuery] = useUser({ urlSlug, subscribe: true });
  const [, showsQuery, activeShow] = useShowsForUser(user?.id);

  const activeShowDescription = useMemo(() => {
    if (showsQuery.loading) {
      return <CircularProgress size={19} color="secondary" />;
    } else if (showsQuery.error) {
      return (
        <Typography color="textSecondary">Error fetching shows</Typography>
      );
    } else if (activeShow) {
      return (
        <Typography color="textSecondary">
          {`${DateTime.formatUserReadableShowtime(activeShow.showtime)}: ${
            activeShow.title
          }`}
        </Typography>
      );
    } else {
      return <Typography color="textSecondary">No shows scheduled</Typography>;
    }
  }, [showsQuery, activeShow]);

  const userIsStreamingLive =
    user?.isInPublicMode && user?.muxLiveStreamStatus === 'active';

  const primaryContent = useMemo(() => {
    if (userQuery.loading || showsQuery.loading) {
      return null;
    } else if (!user) {
      return (
        <Typography align="center">
          Error fetching the user "{urlSlug}". Please double-check your embed
          code.
        </Typography>
      );
    }
  }, [userQuery, showsQuery, user, urlSlug]);

  const secondaryContent = useMemo(() => {
    if (!user || userQuery.loading || showsQuery.loading) {
      return null;
    } else if (activeShow) {
      return (
        <Grid container className={classes.secondaryContent}>
          <Grid className={classes.userInfoContainer}>
            {user.profileImageUrl && (
              <img
                src={user.profileImageUrl}
                alt={user.username}
                className={classes.userImage}
              />
            )}
            <Grid item className={classes.userText}>
              <Typography variant="h6">{user.username}</Typography>
              {user?.isAllowedToStream && activeShowDescription}
            </Grid>
          </Grid>
        </Grid>
      );
    }
  }, [userQuery, showsQuery, user, activeShow, activeShowDescription, classes]);

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={classes.container}
    >
      {primaryContent}
      {secondaryContent}
    </Grid>
  );
};

export default EmbeddedPlayer;
