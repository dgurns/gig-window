import React, { useState, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CopyIcon from '@material-ui/icons/FileCopy';
import DoneIcon from '@material-ui/icons/Done';

const useStyles = makeStyles(({ palette }) => ({
  copyIcon: {
    color: palette.secondary.main,
    cursor: 'pointer',
  },
  doneIcon: {
    color: palette.success.main,
  },
}));

interface Props {
  textToCopy?: string;
  className?: string;
}

const CopyToClipboardButton = ({ textToCopy, className }: Props) => {
  const classes = useStyles();

  const [shouldShowCopiedState, setShouldShowCopiedState] = useState(false);

  useEffect(() => {
    if (shouldShowCopiedState) {
      setTimeout(() => setShouldShowCopiedState(false), 3000);
    }
  }, [shouldShowCopiedState]);

  const onCopyClicked = useCallback(async () => {
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setShouldShowCopiedState(true);
    } catch {
      window.alert('Could not copy text. Please try again');
    }
  }, [textToCopy, setShouldShowCopiedState]);

  return (
    <div className={className}>
      {shouldShowCopiedState ? (
        <DoneIcon className={classes.doneIcon} />
      ) : (
        <CopyIcon onClick={onCopyClicked} className={classes.copyIcon} />
      )}
    </div>
  );
};

export default React.memo(CopyToClipboardButton);
