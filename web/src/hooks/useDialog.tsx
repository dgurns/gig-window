import React, { useState, useCallback } from 'react';
import Grid from '@material-ui/core/Grid';
import DialogComponent from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';

interface DialogProps {
  onClose?: () => void;
  children?: React.ReactNode;
}

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: 'column',
    overflowY: 'scroll',
    padding: theme.spacing(3),
    width: 400,
    [theme.breakpoints.down('xs')]: {
      minWidth: 0,
      width: '100%',
    },
  },
  dialogPaper: {
    overflow: 'visible',
  },
}));

const useDialog = (
  isVisibleByDefault: boolean = false
): [(props: DialogProps) => JSX.Element, (isVisible?: boolean) => void] => {
  const classes = useStyles();

  const [isVisible, setIsVisible] = useState(isVisibleByDefault);

  const Dialog = useCallback(
    (props: DialogProps) => (
      <DialogComponent
        open={isVisible}
        onClose={() => {
          setIsVisible(false);
          props.onClose && props.onClose();
        }}
        classes={{ paper: classes.dialogPaper }}
      >
        <Grid className={classes.container}>{props.children}</Grid>
      </DialogComponent>
    ),
    [isVisible, setIsVisible, classes]
  );

  return [Dialog, (isVisible = true) => setIsVisible(isVisible)];
};

export default useDialog;
