import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Paper,
  Container,
  Typography,
  Grid,
  Button,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useDialog from 'hooks/useDialog';
import useUser from 'hooks/useUser';
import useShows from 'hooks/useShows';
import DateTime from 'services/DateTime';

import ChatBox from 'components/ChatBox';
import PaymentForm from 'components/PaymentForm';
import MoneyInputField from 'components/MoneyInputField';

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
  videoCurtains: {
    background: 'url("images/curtains.jpg")',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
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

  const [PaymentDialog, setPaymentDialogIsVisible] = useDialog();
  const [tipAmount, setTipAmount] = useState('5');

  const onChangeTipAmount = (value: string) => {
    if (value === '' || value === '0') {
      return setTipAmount('');
    } else if (typeof parseInt(value) === 'number') {
      return setTipAmount(`${parseInt(value)}`);
    }
  };

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
            <Grid className={classes.videoCurtains} />
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
        {user.stripeAccountId && (
          <Grid
            item
            container
            direction="row"
            xs={12}
            sm={8}
            md={9}
            justify="flex-end"
          >
            <MoneyInputField
              className={classes.tipAmount}
              value={tipAmount}
              onChange={(event) => onChangeTipAmount(event.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => setPaymentDialogIsVisible(true)}
            >
              Tip
            </Button>
          </Grid>
        )}
      </Grid>

      <PaymentDialog>
        <PaymentForm
          payeeUserId={user.id}
          payeeUsername={user.username}
          prefilledPaymentAmount={tipAmount}
        />
      </PaymentDialog>
    </Container>
  );
};

export default Watch;
