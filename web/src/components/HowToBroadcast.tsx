import React from 'react';
import { Grid, Link, Typography, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import useCurrentUser from 'hooks/useCurrentUser';

const useStyles = makeStyles(({ spacing }) => ({
  title: {
    marginBottom: spacing(2),
  },
  section: {
    marginBottom: spacing(2),
  },
  item: {
    marginBottom: spacing(2),
  },
  rtmpField: {
    maxWidth: 350,
  },
}));

const HowToBroadcast = () => {
  const classes = useStyles();
  const [currentUser] = useCurrentUser();

  return (
    <Grid container direction="column">
      <Typography variant="h6" className={classes.title}>
        How to broadcast:
      </Typography>
      <Grid className={classes.section}>
        <Typography className={classes.item}>
          1. Pick a streaming app - anything that lets you stream to an RTMP
          URL. Many people like <Link href="https://obsproject.com/">OBS</Link>{' '}
          (laptop/desktop) or{' '}
          <Link href="https://streamlabs.com/mobile-app">Streamlabs</Link>{' '}
          (iPad/iPhone/Android), which are free and open source. Both have
          plenty of help resources and guides for getting started.
        </Typography>
        <Typography className={classes.item}>
          <em>Streamlabs quickstart:</em>
          <br />
          - Download app
          <br />
          - On login screen tap "Other Platforms"
          <br />
          - Copy/paste RTMP URL and stream key from below
          <br />
          - Ignore the part about selecting widgets, just click "Next"
          <br />- Press the red button to start streaming
        </Typography>
        <Typography className={classes.item}>
          <em>OBS quickstart:</em>
          <br />
          - Download OBS
          <br />
          - In OBS, click "Settings" in bottom right and go to the "Stream" tab
          <br />
          - Choose "Service: Custom...", copy/paste the RTMP URL from below into
          the "Server" field, and copy/paste the Stream Key
          <br />- Click "Apply", then "OK" and close the window
          <br />- Click "Start Streaming"
        </Typography>
      </Grid>
      <Grid className={classes.section}>
        <Typography className={classes.item}>
          2. Send your stream to this RTMP URL:
        </Typography>
        <TextField
          value={process.env.REACT_APP_RTMP_URL}
          variant="outlined"
          size="small"
          className={classnames([classes.item, classes.rtmpField])}
        />
        <Typography className={classes.item}>
          ...with this stream key (keep it secret!):
        </Typography>
        <TextField
          value={currentUser?.muxStreamKey || ''}
          variant="outlined"
          size="small"
          className={classnames([classes.item, classes.rtmpField])}
        />
      </Grid>
      <Grid className={classes.section}>
        <Typography className={classes.item}>
          3. When you’re broadcasting, you’ll see the stream appear above.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default HowToBroadcast;
