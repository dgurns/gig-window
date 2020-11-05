import React from 'react';

import { Typography, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useDialog from 'hooks/useDialog';
import TextButton from 'components/TextButton';
import CopyToClipboardButton from 'components/CopyToClipboardButton';

const useStyles = makeStyles(({ spacing }) => ({
  title: {
    marginBottom: spacing(2),
  },
  subtext: {
    marginBottom: spacing(3),
  },
  textField: {
    marginBottom: spacing(3),
    position: 'relative',
  },
  copyButton: {
    position: 'absolute',
    right: 6,
    top: 7,
  },
}));

interface Props {
  urlSlug?: string;
}

const ShareButton = ({ urlSlug = '' }: Props) => {
  const classes = useStyles();

  const [ShareDialog, setShareDialogIsVisible] = useDialog();

  const urlToShare = `${window.location.origin}/${urlSlug}`;
  const embedCode = `<iframe width="640" height="360" src="${window.location.origin}/embed/${urlSlug}" />`;

  return (
    <>
      <TextButton onClick={() => setShareDialogIsVisible(true)}>
        Share / Embed
      </TextButton>
      <ShareDialog>
        <Typography variant="h4" className={classes.title}>
          Share URL
        </Typography>
        <TextField
          value={urlToShare}
          variant="outlined"
          size="small"
          className={classes.textField}
          InputProps={{
            endAdornment: (
              <CopyToClipboardButton
                textToCopy={urlToShare}
                className={classes.copyButton}
              />
            ),
          }}
        />

        <Typography variant="h4" className={classes.title}>
          Embed on your site
        </Typography>
        <Typography color="secondary" className={classes.subtext}>
          When you paste this embed code into your site, visitors will be able
          to see upcoming shows and watch two minutes of live video. Then
          they'll be sent here to buy a ticket, watch, chat, and tip.
        </Typography>
        <TextField
          value={embedCode}
          variant="outlined"
          size="small"
          className={classes.textField}
          InputProps={{
            endAdornment: (
              <CopyToClipboardButton
                textToCopy={embedCode}
                className={classes.copyButton}
              />
            ),
          }}
        />
      </ShareDialog>
    </>
  );
};

export default ShareButton;
