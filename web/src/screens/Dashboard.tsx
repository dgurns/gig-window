import React, { useMemo } from 'react';
import { Paper, Button, Grid, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';

import DashboardSubheader from 'components/DashboardSubheader';
import LinkStripeAccountBanner from 'components/LinkStripeAccountBanner';
import UserInfoBlock from 'components/UserInfoBlock';
import DashboardModeSwitcher from 'components/DashboardModeSwitcher';
import LiveVideoArea from 'components/LiveVideoArea';
import StreamPreviewMessage from 'components/StreamPreviewMessage';
import ChatBox from 'components/ChatBox';
import ShareButton from 'components/ShareButton';
import HowToBroadcast from 'components/HowToBroadcast';

const useStyles = makeStyles(({ breakpoints, palette, spacing }) => ({
  container: {
    paddingBottom: spacing(4),
  },
  userInfo: {
    padding: `${spacing(2)}px ${spacing(2)}px`,
  },
  videoChatContainer: {
    flexDirection: 'row',
    height: 500,
    [breakpoints.down('xs')]: {
      flexDirection: 'column',
      height: 'auto',
    },
  },
  videoContainer: {
    backgroundColor: palette.common.black,
    height: '100%',
    [breakpoints.down('xs')]: {
      minHeight: 200,
    },
  },
  requestAccessMessage: {
    color: palette.common.white,
  },
  requestAccessButton: {
    marginTop: spacing(2),
  },
  chat: {
    backgroundColor: palette.common.white,
    height: '100%',
    [breakpoints.down('xs')]: {
      height: 224,
    },
  },
  tools: {
    marginTop: spacing(2),
    paddingLeft: spacing(4),
    paddingRight: spacing(4),
    [breakpoints.down('sm')]: {
      padding: `0 ${spacing(3)}px`,
    },
  },
  howTo: {
    padding: `${spacing(5)}px ${spacing(4)}px ${spacing(12)}px`,
    [breakpoints.down('xs')]: {
      padding: `${spacing(4)}px ${spacing(3)}px`,
    },
  },
}));

const Dashboard = () => {
  const classes = useStyles();

  const [currentUser, currentUserQuery] = useCurrentUser({ subscribe: true });
  const {
    id,
    urlSlug,
    isAllowedToStream,
    muxLiveStreamStatus,
    stripeConnectAccountId,
  } = currentUser ?? {};

  const videoArea = useMemo(() => {
    if (!isAllowedToStream) {
      return (
        <>
          <Typography className={classes.requestAccessMessage}>
            Would you like to stream?
          </Typography>
          <Button
            color="primary"
            variant="contained"
            size="medium"
            className={classes.requestAccessButton}
            onClick={() =>
              window.open(process.env.REACT_APP_REQUEST_ACCESS_FORM_URL)
            }
          >
            Request access
          </Button>
        </>
      );
    } else if (muxLiveStreamStatus === 'active') {
      return <LiveVideoArea />;
    } else {
      return <StreamPreviewMessage muxLiveStreamStatus={muxLiveStreamStatus} />;
    }
  }, [isAllowedToStream, muxLiveStreamStatus, classes]);

  if (!currentUser) {
    return (
      <Container disableGutters maxWidth={false} className={classes.container}>
        <Grid container direction="row" className={classes.userInfo}>
          <Typography color="secondary">Loading...</Typography>
        </Grid>
      </Container>
    );
  }

  const shouldShowLinkStripeAccountMessage =
    isAllowedToStream && !stripeConnectAccountId && !currentUserQuery.loading;

  return (
    <>
      <DashboardSubheader />
      {shouldShowLinkStripeAccountMessage && <LinkStripeAccountBanner />}

      <Container disableGutters maxWidth={false} className={classes.container}>
        <UserInfoBlock user={currentUser} className={classes.userInfo} />
        <Paper elevation={3}>
          {isAllowedToStream && <DashboardModeSwitcher />}
          <Grid container className={classes.videoChatContainer}>
            <Grid
              item
              container
              xs={12}
              sm={6}
              direction="column"
              justify="center"
              alignItems="center"
              className={classes.videoContainer}
            >
              {videoArea}
            </Grid>
            <Grid item container xs={false} sm={6} className={classes.chat}>
              <ChatBox userId={id} />
            </Grid>
          </Grid>
        </Paper>

        <Grid
          container
          direction="row"
          justify="flex-start"
          className={classes.tools}
        >
          <ShareButton urlSlug={urlSlug} />
        </Grid>

        {isAllowedToStream && (
          <Grid
            container
            item
            direction="column"
            xs={12}
            sm={8}
            className={classes.howTo}
          >
            <HowToBroadcast />
          </Grid>
        )}
      </Container>
    </>
  );
};

export default React.memo(Dashboard);
