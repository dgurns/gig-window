import React, { useState } from 'react';
import classnames from 'classnames';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export const EMOJI_OPTIONS = ['👍', '😂', '🎉', '👏', '🔥', '💯'];

const useStyles = makeStyles(({ palette, spacing }) => ({
  container: {
    backgroundColor: palette.common.white,
    borderRadius: spacing(1),
    fontSize: '1.4rem',
    lineHeight: '1.4rem',
    margin: 2,
    width: 'auto',
  },
  trigger: {
    cursor: 'pointer',
    filter: 'grayscale(100%)',
    padding: spacing(1),
    '&:hover': {
      filter: 'grayscale(100%) brightness(85%)',
    },
  },
  emojiOption: {
    cursor: 'pointer',
    padding: spacing(1),
    transition: 'transform 0.05s',
    '&:hover': {
      transform: 'scale(1.3)',
    },
  },
}));

interface Props {
  onEmojiPicked: (emoji: string) => void;
  className?: string;
}

const EmojiPicker = ({ onEmojiPicked, className }: Props) => {
  const classes = useStyles();

  const [isExpanded, setIsExpanded] = useState(false);

  const onTriggerClicked = () => setIsExpanded(!isExpanded);

  const onEmojiClicked = (emoji: string) => {
    setIsExpanded(false);
    onEmojiPicked(emoji);
  };

  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justify="flex-end"
      className={classnames(classes.container, className)}
    >
      {isExpanded &&
        EMOJI_OPTIONS.map((emoji, index) => (
          <span
            onClick={() => onEmojiClicked(emoji)}
            className={classes.emojiOption}
            role="img"
            aria-label={emoji}
            key={index}
          >
            {emoji}
          </span>
        ))}
      <span
        onClick={onTriggerClicked}
        className={classes.trigger}
        role="img"
        aria-label="Open emoji picker"
      >
        {isExpanded ? '🙈' : '😃'}
      </span>
    </Grid>
  );
};

export default React.memo(EmojiPicker);
