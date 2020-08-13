import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';

const TextButton: React.FC<ButtonProps> = (props) => (
  <Button disableRipple {...props} />
);

export default TextButton;
