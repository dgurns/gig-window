import React, { useState, useCallback } from 'react';
import Grid from '@material-ui/core/Grid';
import DialogComponent from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: 'column',
    padding: theme.spacing(3),
    minWidth: 400,
    [theme.breakpoints.down('xs')]: {
      minWidth: 0,
      width: '100%',
    },
  },
}));

const useDialog = (
  isVisibleByDefault: boolean = false
): [React.ComponentType, (isVisible?: boolean) => void] => {
  const classes = useStyles();

  const [isVisible, setIsVisible] = useState(isVisibleByDefault);

  const Dialog = useCallback(
    (props) => (
      <DialogComponent
        open={isVisible}
        onClose={() => setIsVisible(false)}
        {...props}
      >
        <Grid className={classes.container}>{props.children}</Grid>
      </DialogComponent>
    ),
    [isVisible, setIsVisible]
  );

  return [Dialog, (isVisible = true) => setIsVisible(isVisible)];
};

export default useDialog;
