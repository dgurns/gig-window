import React, { useState } from 'react';
import { Grid, Link, Typography, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import useCurrentUser from 'hooks/useCurrentUser';

import TextButton from 'components/TextButton';
import CopyToClipboardButton from 'components/CopyToClipboardButton';

const useStyles = makeStyles(({ spacing, palette }) => ({
  section: {
    marginTop: spacing(2),
  },
  item: {
    marginTop: spacing(2),
  },
  quickstartContainer: {
    marginLeft: spacing(2),
    marginTop: spacing(2),
  },
  quickstartToggle: {
    marginLeft: spacing(1),
    paddingBottom: 3,
  },
  quickstartBody: {
    borderLeft: `1px solid ${palette.secondary.main}`,
    marginLeft: spacing(2),
    paddingLeft: spacing(2),
  },
  inlineCopyButton: {
    display: 'inline',
    paddingLeft: spacing(1),
  },
  rtmpField: {
    maxWidth: 370,
    position: 'relative',
  },
  copyButton: {
    position: 'absolute',
    right: 6,
    top: 7,
  },
}));

const HowToBroadcast = () => {
  const classes = useStyles();
  const [currentUser] = useCurrentUser();

  const [larixQuickstartIsExpanded, setLarixQuickstartIsExpanded] = useState(
    false
  );
  const [obsQuickstartIsExpanded, setObsQuickstartIsExpanded] = useState(false);

  return (
    <Grid container direction="column">
      <Typography variant="h6">How to broadcast:</Typography>
      <Grid className={classes.section}>
        <Typography>
          1. Pick a streaming app - anything that lets you stream to an RTMP
          URL. Many people like OBS (for{' '}
          <Link href="https://obsproject.com/">laptop/desktop</Link>) or Larix
          Broadcaster (for{' '}
          <Link href="https://apps.apple.com/us/app/larix-broadcaster/id1042474385">
            iPhone/iPad
          </Link>{' '}
          or{' '}
          <Link href="https://play.google.com/store/apps/details?id=com.wmspanel.larix_broadcaster">
            Android
          </Link>
          ) , which are free. Both have plenty of help resources and guides for
          getting started.
        </Typography>
        <Typography className={classes.quickstartContainer}>
          <em>Larix Broadcaster instructions</em>
          <TextButton
            onClick={() =>
              setLarixQuickstartIsExpanded(!larixQuickstartIsExpanded)
            }
            className={classes.quickstartToggle}
          >
            {larixQuickstartIsExpanded ? 'Minimize' : 'Expand'}
          </TextButton>
        </Typography>
        {larixQuickstartIsExpanded && (
          <Typography className={classes.quickstartBody}>
            - Download and open app
            <br />
            - Allow access to camera and microphone
            <br />
            - Press the Gear icon in top right
            <br />
            - Press "Connections" and then the Plus icon in top right
            <br />- Enter a name like "GigWindow"
            <br />- For the URL enter{' '}
            <strong>{`${process.env.REACT_APP_RTMP_URL}/${currentUser?.muxStreamKey}`}</strong>
            <CopyToClipboardButton
              textToCopy={`${process.env.REACT_APP_RTMP_URL}/${currentUser?.muxStreamKey}`}
              className={classes.inlineCopyButton}
            />
            <br />
            - Press "Save" and go back to main broadcast screen
            <br />- Press the red button to start streaming
            <br />- Monitor chats here on GigWindow
          </Typography>
        )}
        <Typography className={classes.quickstartContainer}>
          <em>OBS instructions</em>
          <TextButton
            onClick={() => setObsQuickstartIsExpanded(!obsQuickstartIsExpanded)}
            className={classes.quickstartToggle}
          >
            {obsQuickstartIsExpanded ? 'Minimize' : 'Expand'}
          </TextButton>
        </Typography>
        {obsQuickstartIsExpanded && (
          <Typography className={classes.quickstartBody}>
            - Download OBS
            <br />
            - In OBS, click "Settings" in bottom right and go to the "Stream"
            tab
            <br />
            - Choose "Service: Custom...", copy/paste the RTMP URL from below
            into the "Server" field, and copy/paste the Stream Key
            <br />- Click "Apply", then "OK" and close the window
            <br />- Click "Start Streaming"
            <br />- Monitor chats here on GigWindow
          </Typography>
        )}
      </Grid>
      <Grid className={classes.section}>
        <Typography>2. Send your stream to this RTMP URL:</Typography>
        <TextField
          value={process.env.REACT_APP_RTMP_URL}
          variant="outlined"
          size="small"
          className={classnames([classes.item, classes.rtmpField])}
          InputProps={{
            endAdornment: (
              <CopyToClipboardButton
                textToCopy={process.env.REACT_APP_RTMP_URL}
                className={classes.copyButton}
              />
            ),
          }}
        />
        <Typography className={classes.item}>
          ...with this stream key (keep it secret!):
        </Typography>
        <TextField
          value={currentUser?.muxStreamKey || ''}
          variant="outlined"
          size="small"
          className={classnames([classes.item, classes.rtmpField])}
          InputProps={{
            endAdornment: (
              <CopyToClipboardButton
                textToCopy={currentUser?.muxStreamKey}
                className={classes.copyButton}
              />
            ),
          }}
        />
      </Grid>
      <Grid className={classes.section}>
        <Typography>
          3. When you’re broadcasting, you’ll see the stream appear above.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default HowToBroadcast;
