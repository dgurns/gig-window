import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Grid,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Show } from 'types';

const UPDATE_SHOW = gql`
  mutation UpdateShow(
    $id: Int!
    $updatedTitle: String
    $updatedShowtime: String!
    $updatedMinPriceInCents: Int
  ) {
    updateShow(
      data: {
        id: $id
        title: $updatedTitle
        showtime: $updatedShowtime
        minPriceInCents: $updatedMinPriceInCents
      }
    ) {
      id
    }
  }
`;

const useStyles = makeStyles(({ spacing }) => ({
  formField: {
    marginBottom: spacing(3),
  },
  datePicker: {
    width: '100%',
  },
  error: {
    marginBottom: spacing(3),
    textAlign: 'center',
  },
}));

interface Props {
  show: Show;
  onSuccess?: () => void;
}

const EditShowForm = ({ show, onSuccess }: Props) => {
  const { id, title, showtime, minPriceInCents } = show;

  const classes = useStyles();
  const [updateShow, { loading, data, error }] = useMutation(UPDATE_SHOW, {
    errorPolicy: 'all',
  });

  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedShowtime, setUpdatedShowtime] = useState(new Date(showtime));
  const [updatedMinPrice, setUpdatedMinPrice] = useState(
    `${minPriceInCents / 100}`
  );
  const [localValidationError, setLocalValidationError] = useState('');

  useEffect(() => {
    if (data?.updateShow.id) {
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [data, onSuccess]);

  const formatMinPriceInCents = (rawMinPrice?: string): number => {
    let defaultMinPriceInCents = 100;
    const rawMinPriceAsInt = parseInt(rawMinPrice ?? '');
    if (isNaN(rawMinPriceAsInt)) {
      return defaultMinPriceInCents;
    }
    return rawMinPriceAsInt * 100;
  };

  const onSaveClicked = () => {
    setLocalValidationError('');
    if (!updatedTitle || !updatedShowtime || !updatedMinPrice) {
      return setLocalValidationError('Please fill out all the fields');
    } else if (new Date() > updatedShowtime) {
      return setLocalValidationError('Showtime must be in the future');
    }
    updateShow({
      variables: {
        id: id,
        updatedTitle,
        updatedShowtime: updatedShowtime.toISOString(),
        updatedMinPriceInCents: formatMinPriceInCents(updatedMinPrice),
      },
    });
  };

  return (
    <Grid container item direction="column" xs={12}>
      <TextField
        value={updatedTitle}
        onChange={({ target: { value } }) => setUpdatedTitle(value)}
        variant="outlined"
        label="Title"
        className={classes.formField}
      />
      <DatePicker
        selected={updatedShowtime}
        onChange={(date) => (date ? setUpdatedShowtime(date) : null)}
        minDate={new Date()}
        showTimeSelect
        showDisabledMonthNavigation
        timeFormat="HH:mm"
        timeIntervals={15}
        timeCaption="time"
        dateFormat="MMMM d, yyyy h:mm aa"
        customInput={
          <TextField
            variant="outlined"
            label="Date / time"
            className={classes.formField}
          />
        }
        className={classes.datePicker}
      />
      <TextField
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        value={updatedMinPrice}
        onChange={({ target: { value } }) => setUpdatedMinPrice(value)}
        variant="outlined"
        label="Minimum price ($1 or more)"
        className={classes.formField}
      />
      {localValidationError && (
        <Typography variant="body2" color="error" className={classes.error}>
          {localValidationError}
        </Typography>
      )}
      {error && (
        <Typography variant="body2" color="error" className={classes.error}>
          {error.graphQLErrors.map(({ message }) => message)}
        </Typography>
      )}
      <Button
        onClick={onSaveClicked}
        color="primary"
        variant="contained"
        size="medium"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </Grid>
  );
};

export default EditShowForm;
