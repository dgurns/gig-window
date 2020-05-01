import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Paper, Container, Typography, Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useDialog from 'hooks/useDialog';

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
  video: {
    backgroundColor: theme.palette.common.black,
    backgroundSize: 'cover',
    minHeight: 100,
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

  const [PaymentDialog, setPaymentDialogIsVisible] = useDialog();
  const [tipAmount, setTipAmount] = useState('3');

  const onChangeTipAmount = (value: string) => {
    if (value === '') {
      return setTipAmount(value);
    } else if (typeof parseInt(value) === 'number') {
      return setTipAmount(`${parseInt(value)}`);
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
          <Typography variant="h6">Paul Bigelow</Typography>
          <Typography variant="body1" color="textSecondary">
            Today at 7pm: Covers and Improv
          </Typography>
        </Grid>
      </Grid>
      <Paper elevation={3}>
        <Grid container direction="row" className={classes.videoChatContainer}>
          <Grid item xs={12} sm={8} md={9} className={classes.video} />
          <Grid item xs={false} sm={4} md={3} lg={3} className={classes.chat}>
            <ChatBox urlSlug={urlSlug} />
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
      </Grid>

      <PaymentDialog>
        <PaymentForm prefilledPaymentAmount={tipAmount} />
      </PaymentDialog>
    </Container>
  );
};

export default Watch;
