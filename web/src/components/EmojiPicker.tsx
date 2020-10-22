import React, { useState } from 'react';
import classnames from 'classnames';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const EMOJI_OPTIONS = ['👍', '😂', '🎉', '👏', '💯'];

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    width: 'auto',
    fontSize: '1.5rem',
    lineHeight: '1.5rem',
    transition: 'width 1s',
  },
  containerOpen: {
    width: '100%',
  },
  trigger: {
    cursor: 'pointer',
    filter: 'grayscale(100%)',
    padding: spacing(1),
  },
  emojiOption: {
    cursor: 'pointer',
    padding: spacing(1),
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
      className={classnames(classes.container, className, {
        [classes.containerOpen]: isExpanded,
      })}
    >
      {isExpanded &&
        EMOJI_OPTIONS.map((emoji) => (
          <span
            onClick={() => onEmojiClicked(emoji)}
            className={classes.emojiOption}
            role="img"
            aria-label={emoji}
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
