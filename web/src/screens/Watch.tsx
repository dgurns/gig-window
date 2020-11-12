import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Paper, Container, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';
import useUser from 'hooks/useUser';
import useShowsForUser from 'hooks/useShowsForUser';
import useFreePreview from 'hooks/useFreePreview';
import usePayments from 'hooks/usePayments';
import Ui from 'services/Ui';
import User from 'services/User';

import UserInfoBlock from 'components/UserInfoBlock';
import ShowMarquee from 'components/ShowMarquee';
import LiveVideoArea from 'components/LiveVideoArea';
import Paywall from 'components/Paywall';
import ChatBox from 'components/ChatBox';
import ShareButton from 'components/ShareButton';
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
  userInfo: {
    padding: `${spacing(4)}px ${spacing(4)}px`,
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
    background: 'url("/images/curtains.jpg")',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    height: '100%',
    position: 'relative',
    [breakpoints.down('xs')]: {
      minHeight: 260,
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
    paddingLeft: spacing(4),
    paddingRight: spacing(4),
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

  const [currentUser] = useCurrentUser();
  const [user, userQuery] = useUser({ urlSlug, subscribe: true });
  const { freePreviewIsUsed } = useFreePreview({
    userUrlSlug: urlSlug,
  });

  const [, showsQuery, activeShow] = useShowsForUser(user?.id);
  const { paymentForShow, recentPaymentsToPayee } = usePayments({
    showId: activeShow?.id,
    payeeUserId: user?.id,
  });

  const videoArea = useMemo(() => {
    if (!user) return null;

    const shouldShowLiveVideo =
      user.isInPublicMode && user.muxLiveStreamStatus === 'active';
    const hasAccessToLiveVideo = User.hasAccessToLiveVideo({
      user: currentUser,
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
    currentUser,
    freePreviewIsUsed,
    paymentForShow,
    recentPaymentsToPayee,
    activeShow,
  ]);

  if (userQuery.loading) {
    return (
      <Container disableGutters maxWidth={false}>
        <Grid container direction="row" className={classes.userInfo}>
          <Typography color="secondary">Loading...</Typography>
        </Grid>
      </Container>
    );
  } else if (!user || userQuery.error) {
    return (
      <Container disableGutters maxWidth={false}>
        <Grid container direction="row" className={classes.userInfo}>
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
      <UserInfoBlock user={user} className={classes.userInfo} />
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
        <Grid
          item
          container
          direction="row"
          xs={12}
          sm={8}
          justify="space-between"
        >
          <ShareButton urlSlug={user.urlSlug} />
          {shouldShowTipButton && <TipButton payee={user} show={activeShow} />}
        </Grid>
      </Grid>
    </Container>
  );
};

export default React.memo(Watch);
