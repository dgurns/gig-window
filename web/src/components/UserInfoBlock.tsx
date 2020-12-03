import React, { useMemo } from 'react';
import classnames from 'classnames';
import { Grid, Typography, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandIcon from '@material-ui/icons/KeyboardArrowDown';

import { User } from 'types';
import Image from 'services/Image';
import DateTime from 'services/DateTime';
import useShowsForUser from 'hooks/useShowsForUser';
import useDialog from 'hooks/useDialog';

import UpcomingSchedule from 'components/UpcomingSchedule';

const useStyles = makeStyles(({ spacing, palette }) => ({
  container: {
    alignItems: 'center',
  },
  image: {
    borderRadius: spacing(1),
    height: 80,
    marginRight: spacing(2),
    width: 80 * Image.DEFAULT_IMAGE_ASPECT_RATIO,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  description: {
    color: palette.secondary.main,
  },
  activeShowDescription: {
    color: palette.secondary.main,
    cursor: 'pointer',
    '&:hover': {
      color: palette.secondary.dark,
    },
  },
  expandIcon: {
    marginBottom: -7,
  },
}));

interface Props {
  user: User;
  className?: string;
}

const UserInfoBlock = ({ user, className }: Props) => {
  const classes = useStyles();

  const [shows, showsQuery, activeShow] = useShowsForUser(user?.id);
  const [
    UpcomingScheduleDialog,
    setUpcomingScheduleDialogIsVisible,
  ] = useDialog();

  const activeShowDescription = useMemo(() => {
    if (showsQuery.loading) {
      return <CircularProgress size={19} color="secondary" />;
    } else if (showsQuery.error) {
      return (
        <Typography className={classes.description}>
          Error fetching shows
        </Typography>
      );
    } else if (activeShow) {
      return (
        <Grid container direction="row">
          <Typography
            className={classes.activeShowDescription}
            onClick={() => setUpcomingScheduleDialogIsVisible(true)}
          >
            {`${DateTime.formatUserReadableShowtime(activeShow.showtime)}: ${
              activeShow.title
            }`}
            <ExpandIcon className={classes.expandIcon} />
          </Typography>
        </Grid>
      );
    } else {
      return (
        <Typography className={classes.description}>
          No shows scheduled
        </Typography>
      );
    }
  }, [showsQuery, activeShow, classes, setUpcomingScheduleDialogIsVisible]);

  return (
    <Grid
      container
      direction="row"
      className={classnames(classes.container, className)}
    >
      {user.profileImageUrl && (
        <img src={user.profileImageUrl} alt="Watch" className={classes.image} />
      )}
      <Grid item className={classes.textContainer}>
        <Typography variant="h6" color="inherit">
          {user.username}
        </Typography>
        {user?.isAllowedToStream && activeShowDescription}
      </Grid>

      <UpcomingScheduleDialog>
        <UpcomingSchedule user={user} shows={shows} />
      </UpcomingScheduleDialog>
    </Grid>
  );
};

export default UserInfoBlock;
