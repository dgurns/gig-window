import React from 'react';
import classnames from 'classnames';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useCustomParagraphStyles = makeStyles(({ spacing }) => ({
  customParagraph: {
    marginBottom: 0,
    marginTop: 0,
  },
}));

interface CustomParagraphProps {
  children: JSX.Element;
}
const CustomParagraph = ({ children }: CustomParagraphProps) => {
  const classes = useCustomParagraphStyles();
  return <p className={classes.customParagraph}>{children}</p>;
};

const useMarkdownRendererStyles = makeStyles(({ spacing }) => ({
  container: {
    '& p + p': {
      marginTop: spacing(2),
    },
  },
}));

interface MarkdownRendererProps {
  rawMarkdown?: string;
  className?: string;
}

const MarkdownRenderer = ({
  rawMarkdown,
  className,
}: MarkdownRendererProps) => {
  const classes = useMarkdownRendererStyles();

  if (!rawMarkdown) {
    return null;
  }

  return (
    <Typography
      component="div"
      className={classnames(classes.container, className)}
    >
      <ReactMarkdown
        renderers={{
          link: Link,
          paragraph: CustomParagraph,
        }}
        plugins={[gfm]}
        children={rawMarkdown}
        linkTarget="_blank"
      />
    </Typography>
  );
};

export default MarkdownRenderer;
