import React, { useMemo } from 'react';
import classnames from 'classnames';
import { Grid, Typography, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { User } from 'types';
import Image from 'services/Image';
import DateTime from 'services/DateTime';
import useShowsForUser from 'hooks/useShowsForUser';

const useStyles = makeStyles(({ spacing }) => ({
  userInfoContainer: {
    alignItems: 'center',
  },
  userImage: {
    height: 80,
    marginRight: spacing(2),
    width: 80 * Image.DEFAULT_IMAGE_ASPECT_RATIO,
  },
  userText: {
    flex: 1,
    flexDirection: 'column',
  },
}));

interface Props {
  user: User;
  className?: string;
}

const UserInfoBlock = ({ user, className }: Props) => {
  const classes = useStyles();

  const [, showsQuery, activeShow] = useShowsForUser(user?.id);

  const activeShowDescription = useMemo(() => {
    if (showsQuery.loading) {
      return <CircularProgress size={19} color="secondary" />;
    } else if (showsQuery.error) {
      return (
        <Typography color="textSecondary">Error fetching shows</Typography>
      );
    } else if (activeShow) {
      return (
        <Typography color="textSecondary">
          {`${DateTime.formatUserReadableShowtime(activeShow.showtime)}: ${
            activeShow.title
          }`}
        </Typography>
      );
    } else {
      return <Typography color="textSecondary">No shows scheduled</Typography>;
    }
  }, [showsQuery, activeShow]);

  return (
    <Grid
      container
      direction="row"
      className={classnames(classes.userInfoContainer, className)}
    >
      {user.profileImageUrl && (
        <img
          src={user.profileImageUrl}
          alt="Watch"
          className={classes.userImage}
        />
      )}
      <Grid item className={classes.userText}>
        <Typography variant="h6" color="inherit">
          {user.username}
        </Typography>
        {user?.isAllowedToStream && activeShowDescription}
      </Grid>
    </Grid>
  );
};

export default UserInfoBlock;
