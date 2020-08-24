import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Paper,
  Container,
  Typography,
  Grid,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useUser from 'hooks/useUser';
import useShowsForUser from 'hooks/useShowsForUser';
import useFreePreview from 'hooks/useFreePreview';
import usePayments from 'hooks/usePayments';
import DateTime from 'services/DateTime';
import Ui from 'services/Ui';
import Image from 'services/Image';
import User from 'services/User';

import ShowMarquee from 'components/ShowMarquee';
import LiveVideoArea from 'components/LiveVideoArea';
import Paywall from 'components/Paywall';
import ChatBox from 'components/ChatBox';
import TipButton from 'components/TipButton';

const useStyles = makeStyles(({ spacing, breakpoints, palette }) => ({
  pageContainer: {
    paddingBottom: spacing(4),
    width: '100%',
  },
  subheaderLink: {
    margin: `0 ${spacing(3)}px`,
    [breakpoints.down('xs')]: {
      margin: `${spacing(1)}px ${spacing(3)}px`,
    },
  },
  userInfoContainer: {
    alignItems: 'center',
    padding: `${spacing(4)}px ${spacing(4)}px`,
    [breakpoints.down('xs')]: {
      alignItems: 'flex-start',
      flexDirection: 'column-reverse',
      padding: `${spacing(3)}px ${spacing(3)}px`,
    },
  },
  userImage: {
    height: 80,
    marginRight: spacing(2),
    width: 80 * Image.DEFAULT_IMAGE_ASPECT_RATIO,
    [breakpoints.down('xs')]: {
      marginTop: spacing(2),
    },
  },
  userText: {
    flexDirection: 'column',
  },
  videoChatContainer: {
    flexDirection: 'row',
    height: 520,
    [breakpoints.down('xs')]: {
      flexDirection: 'column',
      height: 'auto',
    },
  },
  videoContainer: {
    backgroundColor: palette.common.black,
    background: 'url("images/curtains.jpg")',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    height: '100%',
    position: 'relative',
    [breakpoints.down('xs')]: {
      height: 260,
    },
  },
  chat: {
    backgroundColor: palette.common.white,
    height: '100%',
    [breakpoints.down('xs')]: {
      height: 260,
    },
  },
  tools: {
    marginTop: spacing(2),
    [breakpoints.down('sm')]: {
      padding: `0 ${spacing(2)}px`,
    },
  },
  tipAmount: {
    marginRight: spacing(1),
    width: 56,
  },
}));

const Watch = () => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const urlSlug = pathname.split('/')[1];

  const [user, userQuery] = useUser({ urlSlug, subscribe: true });
  const { freePreviewIsUsed } = useFreePreview({
    userUrlSlug: urlSlug,
  });

  const [, showsQuery, activeShow] = useShowsForUser(user?.id);
  const { paymentForShow, recentPaymentsToPayee } = usePayments({
    showId: activeShow?.id,
    payeeUserId: user?.id,
  });

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

  const videoArea = useMemo(() => {
    if (!user) return null;

    const shouldShowLiveVideo =
      user.isInPublicMode && user.muxLiveStreamStatus === 'active';
    const hasAccessToLiveVideo = User.hasAccessToLiveVideo({
      paymentForShow,
      recentPaymentsToPayee,
    });

    if (shouldShowLiveVideo && freePreviewIsUsed && !hasAccessToLiveVideo) {
      return <Paywall show={activeShow} payee={user} />;
    } else if (shouldShowLiveVideo) {
      return <LiveVideoArea show={activeShow} payee={user} />;
    } else if (activeShow) {
      return <ShowMarquee show={activeShow} payee={user} />;
    }
  }, [
    user,
    freePreviewIsUsed,
    paymentForShow,
    recentPaymentsToPayee,
    activeShow,
  ]);

  if (userQuery.loading) {
    return (
      <Container disableGutters maxWidth={false}>
        <Grid container direction="row" className={classes.userInfoContainer}>
          <Typography color="secondary">Loading...</Typography>
        </Grid>
      </Container>
    );
  } else if (!user || userQuery.error) {
    return (
      <Container disableGutters maxWidth={false}>
        <Grid container direction="row" className={classes.userInfoContainer}>
          <Typography color="secondary">
            {userQuery.error
              ? 'Error fetching user'
              : 'Could not find this user'}
          </Typography>
        </Grid>
      </Container>
    );
  }

  const shouldShowTipButton =
    !showsQuery.loading &&
    Ui.shouldShowTipButton({
      payee: user,
      isActiveShow: Boolean(activeShow),
      paymentForShow,
      recentPaymentsToPayee,
    });

  return (
    <Container
      disableGutters
      maxWidth={false}
      className={classes.pageContainer}
    >
      <Grid container direction="row" className={classes.userInfoContainer}>
        {user.profileImageUrl && (
          <img
            src={user.profileImageUrl}
            alt="Watch"
            className={classes.userImage}
          />
        )}
        <Grid item className={classes.userText}>
          <Typography variant="h6">{user.username}</Typography>
          {user?.isAllowedToStream && activeShowDescription}
        </Grid>
      </Grid>
      <Paper elevation={3}>
        <Grid container className={classes.videoChatContainer}>
          <Grid item xs={12} sm={8} className={classes.videoContainer}>
            {videoArea}
          </Grid>
          <Grid item xs={false} sm={4} className={classes.chat}>
            <ChatBox userId={user.id} />
          </Grid>
        </Grid>
      </Paper>
      <Grid
        container
        direction="row"
        justify="flex-start"
        className={classes.tools}
      >
        <Grid item container direction="row" xs={12} sm={8} justify="flex-end">
          {shouldShowTipButton && <TipButton payee={user} show={activeShow} />}
        </Grid>
      </Grid>
    </Container>
  );
};

export default React.memo(Watch);
