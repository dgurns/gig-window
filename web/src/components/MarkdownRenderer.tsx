import React from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { Link, Typography } from '@material-ui/core';

interface Props {
  rawMarkdown?: string;
  className?: string;
}

const MarkdownRenderer = ({ rawMarkdown, className }: Props) => {
  if (!rawMarkdown) {
    return null;
  }

  return (
    <Typography component="span" className={className}>
      <ReactMarkdown
        renderers={{
          link: Link,
        }}
        plugins={[gfm]}
        children={rawMarkdown}
        linkTarget="_blank"
      />
    </Typography>
  );
};

export default MarkdownRenderer;
