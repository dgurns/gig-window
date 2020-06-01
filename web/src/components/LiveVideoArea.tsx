import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import PlayButton from '@material-ui/icons/PlayArrow';

import useUser from 'hooks/useUser';
import useShows from 'hooks/useShows';
import usePayments from 'hooks/usePayments';
import DateTime from 'services/DateTime';
import Ui from 'services/Ui';
import User from 'services/User';

import VideoPlayer from './VideoPlayer';

const useStyles = makeStyles(({ palette }) => ({
  container: {
    height: '100%',
    position: 'relative',
    width: '100%',
  },
  playerOverlay: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  playButtonContainer: {
    color: palette.common.white,
    cursor: 'pointer',
    height: '100%',
    width: '100%',
    '&:hover #play-button': {
      fontSize: '12rem',
    },
  },
  playButton: {
    fontSize: '10rem',
  },
}));

interface LiveVideoAreaProps {
  show?: {
    id: number;
  };
  payee: {
    id: number;
    username: string;
    stripeAccountId?: string;
  };
}

const LiveVideoArea = (props: LiveVideoAreaProps) => {
  const classes = useStyles();

  return (
    <Grid className={classes.container}>
      <Grid container className={classes.playerOverlay}>
        <Grid
          item
          container
          justify="center"
          alignItems="center"
          className={classes.playButtonContainer}
        >
          <PlayButton id="play-button" className={classes.playButton} />
        </Grid>
      </Grid>
      <VideoPlayer
        hlsUrl="https://www.youtube.com/watch?v=ysz5S6PUM-U"
        isPlaying={false}
      />
    </Grid>
  );
};

export default LiveVideoArea;
