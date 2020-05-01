import React from 'react';
import {
  TextField,
  InputAdornment,
  OutlinedTextFieldProps,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  tipInputStartAdornment: {
    paddingLeft: 7,
  },
  tipInputInterior: {
    marginBottom: 1,
    marginLeft: -3,
    paddingRight: 0,
  },
}));

const MoneyInputField = (props: OutlinedTextFieldProps) => {
  const classes = useStyles();

  return (
    <TextField
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
        classes: {
          adornedStart: classes.tipInputStartAdornment,
          input: classes.tipInputInterior,
        },
      }}
      size="small"
      {...props}
    />
  );
};

MoneyInputField.defaultProps = {
  variant: 'outlined',
};

export default MoneyInputField;
