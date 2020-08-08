import React from 'react';
import { Grid, Link, Typography, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import useCurrentUser from 'hooks/useCurrentUser';

const useStyles = makeStyles((theme) => ({
  howToItem: {
    marginBottom: 11,
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
      <Typography variant="h6" className={classes.howToItem}>
        How to broadcast:
      </Typography>
      <Typography className={classes.howToItem}>
        1. Pick a streaming app - anything that lets you stream to an RTMP URL.
        Many people like <Link href="https://obsproject.com/">OBS</Link>{' '}
        (laptop/desktop) or{' '}
        <Link href="https://streamlabs.com/mobile-app">Streamlabs</Link>{' '}
        (iPad/iPhone/Android), which are free and open source. Both have plenty
        of help resources and guides for getting started.
      </Typography>
      <Typography className={classes.howToItem}>
        <em>Streamlabs quickstart:</em>
        <br />
        - Download app
        <br />
        - On login screen tap "Other Platforms"
        <br />
        - Copy/paste RTMP URL and stream key from below
        <br />
        - Tap "Save" and close Settings screen
        <br />- Press the red button to start streaming
      </Typography>
      <Typography className={classes.howToItem}>
        <em>OBS quickstart:</em>
        <br />
        - Download software
        <br />
        - Click "Settings" in bottom right and go to the "Stream" tab
        <br />
        - Choose "Service: Custom...", copy/paste the RTMP URL from below into
        the "Server" field, and copy/paste the Stream Key
        <br />- Click "Apply", then "OK" and close the window
        <br />- Click "Start Streaming"
      </Typography>
      <Typography className={classes.howToItem}>
        2. Send your stream to this RTMP URL:
      </Typography>
      <TextField
        value={process.env.REACT_APP_RTMP_URL}
        variant="outlined"
        size="small"
        className={classnames([classes.howToItem, classes.rtmpField])}
      />
      <Typography className={classes.howToItem}>
        ...with this stream key (keep it secret!):
      </Typography>
      <TextField
        value={currentUser?.streamKey || ''}
        variant="outlined"
        size="small"
        className={classnames([classes.howToItem, classes.rtmpField])}
      />
      <Typography className={classes.howToItem}>
        3. When you’re broadcasting, you’ll see the stream appear above.
      </Typography>
    </Grid>
  );
};

export default HowToBroadcast;
