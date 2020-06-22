import React from 'react';
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
import usePayments from 'hooks/usePayments';
import DateTime from 'services/DateTime';
import Ui from 'services/Ui';
import User from 'services/User';
import Image from 'services/Image';

import ShowMarquee from 'components/ShowMarquee';
import LiveVideoArea from 'components/LiveVideoArea';
import ChatBox from 'components/ChatBox';
import TipButton from 'components/TipButton';

const useStyles = makeStyles((theme) => ({
  pageContent: {
    paddingTop: 35,
    width: '100%',
  },
  subheaderLink: {
    margin: `0 ${theme.spacing(3)}px`,
    [theme.breakpoints.down('xs')]: {
      margin: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
    },
  },
  userInfoContainer: {
    alignItems: 'center',
    padding: `${theme.spacing(4)}px ${theme.spacing(4)}px`,
    [theme.breakpoints.down('xs')]: {
      alignItems: 'flex-start',
      flexDirection: 'column-reverse',
      padding: `${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
  },
  userImage: {
    height: 80,
    marginRight: theme.spacing(2),
    width: 80 * Image.DEFAULT_IMAGE_ASPECT_RATIO,
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(2),
    },
  },
  userText: {
    flexDirection: 'column',
  },
  videoChatContainer: {
    height: 520,
  },
  videoContainer: {
    backgroundColor: theme.palette.common.black,
    background: 'url("images/curtains.jpg")',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    height: '100%',
    minHeight: 250,
    maxHeight: 520,
    position: 'relative',
  },
  chat: {
    backgroundColor: theme.palette.common.white,
    height: 520,
  },
  tools: {
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: `0 ${theme.spacing(2)}px`,
    },
  },
  tipAmount: {
    marginRight: theme.spacing(1),
    width: 56,
  },
}));

const Watch = () => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const urlSlug = pathname.split('/')[1];

  const [user, userQuery] = useUser({ urlSlug, subscribe: true });
  const [, showsQuery, activeShow] = useShowsForUser(user?.id);
  const { paymentForShow, recentPaymentsToPayee } = usePayments({
    showId: activeShow?.id,
    payeeUserId: user?.id,
  });

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

  const renderActiveShowDescription = () => {
    if (showsQuery.loading) {
      return <CircularProgress size={15} color="secondary" />;
    } else if (showsQuery.error) {
      return 'Error fetching shows';
    } else if (activeShow) {
      return `${DateTime.formatUserReadableShowtime(activeShow.showtime)}: ${
        activeShow.title
      }`;
    } else {
      return 'No shows scheduled';
    }
  };

  const userIsLive = User.isStreamingLive(
    user.isPublishingStream,
    user.isInPublicMode
  );
  const shouldShowTipButton =
    !showsQuery.loading &&
    Ui.shouldShowTipButton({
      payee: user,
      isActiveShow: Boolean(activeShow),
      userHasPaymentForShow: Boolean(paymentForShow),
      userHasRecentPaymentToPayee: Boolean(recentPaymentsToPayee?.length),
    });

  return (
    <Container disableGutters maxWidth={false}>
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
          <Typography variant="body1" color="textSecondary">
            {renderActiveShowDescription()}
          </Typography>
        </Grid>
      </Grid>
      <Paper elevation={3}>
        <Grid container direction="row" className={classes.videoChatContainer}>
          <Grid item xs={12} sm={8} md={9} className={classes.videoContainer}>
            {!userIsLive && activeShow && (
              <ShowMarquee show={activeShow} payee={user} />
            )}
            {userIsLive && <LiveVideoArea show={activeShow} payee={user} />}
          </Grid>
          <Grid item xs={false} sm={4} md={3} lg={3} className={classes.chat}>
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
          md={9}
          justify="flex-end"
        >
          {shouldShowTipButton && <TipButton payee={user} show={activeShow} />}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Watch;
