import React, { useState } from 'react';
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
    backgroundColor: palette.common.black,
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
    zIndex: 20,
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
  videoPlayer: {
    height: '100%',
    width: '100%',
    zIndex: 10,
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

  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Grid className={classes.container}>
      {!isPlaying && (
        <Grid container className={classes.playerOverlay}>
          <Grid
            item
            container
            justify="center"
            alignItems="center"
            className={classes.playButtonContainer}
            onClick={() => setIsPlaying(true)}
          >
            <PlayButton id="play-button" className={classes.playButton} />
          </Grid>
        </Grid>
      )}
      <Grid item container className={classes.videoPlayer}>
        <VideoPlayer
          hlsUrl="https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8"
          isPlaying={isPlaying}
        />
      </Grid>
    </Grid>
  );
};

export default LiveVideoArea;
