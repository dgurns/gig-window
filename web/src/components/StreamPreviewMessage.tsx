import React from 'react';
import { useMutation, gql } from '@apollo/client';
import { Typography, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import TextButton from 'components/TextButton';

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
    padding: `0 ${spacing(4)}px`,
    textAlign: 'center',
  },
  loadingIndicator: {
    marginTop: spacing(2),
    width: 100,
  },
  regenerateConfigButton: {
    marginTop: spacing(2),
  },
}));

interface Props {
  muxLiveStreamStatus?: string;
}

const StreamPreviewMessage = ({ muxLiveStreamStatus }: Props) => {
  const classes = useStyles();

  const [regenerateLiveStreamConfig, { loading, data }] = useMutation(
    REGENERATE_LIVE_STREAM_CONFIG_FOR_USER,
    {
      errorPolicy: 'all',
    }
  );

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
      message =
        loading || data
          ? 'Regenerating live stream config...'
          : 'In test environments, streams are disabled after 5 minutes. To continue, regenerate the config and then paste the new stream key into your encoder';
      break;
    default:
      message = 'No stream detected';
  }

  const shouldShowLoadingIndicator = muxLiveStreamStatus === 'recording';
  const shouldShowRegenerateButton =
    muxLiveStreamStatus === 'disabled' && !loading && !data;

  return (
    <>
      <Typography className={classes.streamPreviewMessage}>
        {message}
      </Typography>
      {shouldShowLoadingIndicator && (
        <CircularProgress
          color="secondary"
          className={classes.loadingIndicator}
        />
      )}
      {shouldShowRegenerateButton && (
        <TextButton
          onClick={() => regenerateLiveStreamConfig()}
          className={classes.regenerateConfigButton}
        >
          Regenerate live stream config
        </TextButton>
      )}
    </>
  );
};

export default React.memo(StreamPreviewMessage);
