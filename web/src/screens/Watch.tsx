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
import useShows from 'hooks/useShows';
import DateTime from 'services/DateTime';

import ShowMarquee from 'components/ShowMarquee';
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
    height: 72,
    marginRight: theme.spacing(2),
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

  const [user, userQuery] = useUser({ urlSlug });
  const [, showsQuery, activeShow] = useShows(user?.id);

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
          <Typography color="secondary">Could not find this user</Typography>
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

  return (
    <Container disableGutters maxWidth={false}>
      <Grid container direction="row" className={classes.userInfoContainer}>
        <img
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.daytonlocal.com%2Fimages%2Fmusic%2Fdayton-celtic-festival-gaelic-storm.jpg&f=1&nofb=1"
          alt="Watch"
          className={classes.userImage}
        />
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
            {activeShow && (
              <ShowMarquee
                showtime={activeShow.showtime}
                payeeUserId={user.id}
                payeeUsername={user.username}
              />
            )}
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
          {user.stripeAccountId && (
            <TipButton payeeUserId={user.id} payeeUsername={user.username} />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Watch;
