import React from 'react';
import { TextField, InputAdornment, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  tipInput: {
    marginRight: theme.spacing(1),
    width: 56
  },
  tipInputStartAdornment: {
    paddingLeft: 7
  },
  tipInputInterior: {
    marginBottom: 1,
    marginLeft: -3,
    paddingRight: 0
  }
}));

const TipButton = () => {
  const classes = useStyles();

  return (
    <>
      <TextField
        defaultValue="3"
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
          classes: {
            adornedStart: classes.tipInputStartAdornment,
            input: classes.tipInputInterior
          }
        }}
        size="small"
        variant="outlined"
        className={classes.tipInput}
      />
      <Button variant="contained" color="primary" size="small">
        Tip
      </Button>
    </>
  );
};

export default TipButton;
