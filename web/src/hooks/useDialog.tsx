import React, { useState, useCallback } from 'react';

import Grid from '@material-ui/core/Grid';
import DialogComponent from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    overflow: 'visible',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  dialogPaperFullscreen: {
    overflow: 'visible',
    height: '70%',
    minWidth: '96%',
  },
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
  containerFullscreen: {
    flexDirection: 'column',
    overflowY: 'scroll',
    padding: theme.spacing(3),
    height: '100%',
    width: '100%',
  },
}));

interface DialogProps {
  onClose?: () => void;
  fullscreen?: boolean;
  children?: React.ReactNode;
}

const useDialog = (
  isVisibleByDefault: boolean = false
): [(props: DialogProps) => JSX.Element, (isVisible?: boolean) => void] => {
  const classes = useStyles();

  const [isVisible, setIsVisible] = useState(isVisibleByDefault);

  const Dialog = useCallback(
    ({ onClose, fullscreen = false, children }: DialogProps) => (
      <DialogComponent
        open={isVisible}
        onClose={() => {
          setIsVisible(false);
          onClose && onClose();
        }}
        classes={{
          paper: fullscreen
            ? classes.dialogPaperFullscreen
            : classes.dialogPaper,
        }}
      >
        <Grid
          className={
            fullscreen ? classes.containerFullscreen : classes.container
          }
        >
          {children}
        </Grid>
      </DialogComponent>
    ),
    [isVisible, setIsVisible, classes]
  );

  return [Dialog, (isVisible = true) => setIsVisible(isVisible)];
};

export default useDialog;
