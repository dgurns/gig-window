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

  const [
    streamlabsQuickstartIsExpanded,
    setStreamlabsQuickstartIsExpanded,
  ] = useState(false);
  const [obsQuickstartIsExpanded, setObsQuickstartIsExpanded] = useState(false);

  return (
    <Grid container direction="column">
      <Typography variant="h6">How to broadcast:</Typography>
      <Grid className={classes.section}>
        <Typography>
          1. Pick a streaming app - anything that lets you stream to an RTMP
          URL. Many people like <Link href="https://obsproject.com/">OBS</Link>{' '}
          (laptop/desktop) or{' '}
          <Link href="https://streamlabs.com/mobile-app">Streamlabs</Link>{' '}
          (iPad/iPhone/Android), which are free and open source. Both have
          plenty of help resources and guides for getting started.
        </Typography>
        <Typography className={classes.quickstartContainer}>
          <em>Streamlabs quickstart</em>
          <TextButton
            onClick={() =>
              setStreamlabsQuickstartIsExpanded(!streamlabsQuickstartIsExpanded)
            }
            className={classes.quickstartToggle}
          >
            {streamlabsQuickstartIsExpanded ? 'Minimize' : 'Expand'}
          </TextButton>
        </Typography>
        {streamlabsQuickstartIsExpanded && (
          <Typography className={classes.quickstartBody}>
            - Download app
            <br />
            - On login screen tap "Other Platforms"
            <br />
            - Copy/paste RTMP URL and stream key from below
            <br />
            - Ignore the part about selecting widgets, just click "Next"
            <br />- Press the red button to start streaming
          </Typography>
        )}
        <Typography className={classes.quickstartContainer}>
          <em>OBS quickstart</em>
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
