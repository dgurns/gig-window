import React, { useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Typography, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';

const REGENERATE_LIVE_STREAM_CONFIG_FOR_USER = gql`
  mutation RegenerateLiveStreamConfigForUser {
    regenerateLiveStreamConfigForUser {
      id
    }
  }
`;

const useStyles = makeStyles(({ palette, spacing }) => ({
  streamPreviewMessage: {
    color: palette.common.white,
    marginRight: spacing(2),
    textAlign: 'center',
  },
  loadingIndicator: {
    marginTop: spacing(2),
    width: 100,
  },
}));

const StreamPreviewMessage = () => {
  const classes = useStyles();

  const [currentUser] = useCurrentUser({ subscribe: true });
  const { muxLiveStreamStatus } = currentUser ?? {};

  const [regenerateLiveStreamConfig, { loading }] = useMutation(
    REGENERATE_LIVE_STREAM_CONFIG_FOR_USER,
    {
      errorPolicy: 'all',
    }
  );

  useEffect(() => {
    // When Mux streams are in test mode, they will become disabled after
    // 5 minutes, so we regenerate live stream config for this user
    if (muxLiveStreamStatus === 'disabled' && !loading) {
      window.alert(
        'In test environments there is a 5 minute limit for "test mode" streams. Regenerating your live stream config - please paste the new stream key into your encoder'
      );
      regenerateLiveStreamConfig();
    }
  }, [muxLiveStreamStatus, loading, regenerateLiveStreamConfig]);

  let message;
  switch (muxLiveStreamStatus) {
    case 'connected':
      message = 'Encoder connected';
      break;
    case 'recording':
      message = 'Receiving stream and preparing for playback...';
      break;
    case 'disconnected':
      message = 'Encoder disconnected';
      break;
    case 'disabled':
      message = loading ? 'Regenerating live stream config...' : '';
      break;
    default:
      message = 'No stream detected';
  }
  return (
    <>
      <Typography className={classes.streamPreviewMessage}>
        {message}
      </Typography>
      {muxLiveStreamStatus === 'recording' && (
        <CircularProgress
          color="secondary"
          className={classes.loadingIndicator}
        />
      )}
    </>
  );
};

export default React.memo(StreamPreviewMessage);
