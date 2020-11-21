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

import TextButton from 'components/TextButton';

const CREATE_SHOW = gql`
  mutation CreateShow(
    $title: String
    $showtime: String!
    $minPriceInCents: Int
  ) {
    createShow(
      data: {
        title: $title
        showtime: $showtime
        minPriceInCents: $minPriceInCents
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
  moreOptions: {
    marginBottom: spacing(3),
  },
  error: {
    marginBottom: spacing(3),
    textAlign: 'center',
  },
}));

interface Props {
  onSuccess?: () => void;
}

const CreateShowForm = ({ onSuccess }: Props) => {
  const classes = useStyles();
  const [createShow, { loading, data, error }] = useMutation(CREATE_SHOW, {
    errorPolicy: 'all',
  });

  const [title, setTitle] = useState('');
  const [showtime, setShowtime] = useState<Date | null>(null);
  const [minPrice, setMinPrice] = useState('1');
  const [shouldShowMoreOptions, setShouldShowMoreOptions] = useState(false);
  const [localValidationError, setLocalValidationError] = useState('');

  useEffect(() => {
    if (data?.createShow.id) {
      setTitle('');
      setShowtime(null);
      setShouldShowMoreOptions(false);
      setMinPrice('1');

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

  const onCreateClicked = () => {
    setLocalValidationError('');
    if (!title || !showtime || !minPrice) {
      return setLocalValidationError('Please fill out all the fields');
    } else if (new Date() > showtime) {
      return setLocalValidationError('Showtime must be in the future');
    }
    createShow({
      variables: {
        title,
        showtime: showtime.toISOString(),
        minPriceInCents: formatMinPriceInCents(minPrice),
      },
    });
  };

  return (
    <Grid container item direction="column" xs={12} md={5}>
      <TextField
        value={title}
        onChange={({ target: { value } }) => setTitle(value)}
        variant="outlined"
        label="Title"
        className={classes.formField}
      />
      <DatePicker
        selected={showtime}
        onChange={(date) => setShowtime(date)}
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
      {!shouldShowMoreOptions ? (
        <Grid
          container
          className={classes.moreOptions}
          direction="row"
          justify="flex-start"
        >
          <TextButton onClick={() => setShouldShowMoreOptions(true)}>
            More options
          </TextButton>
        </Grid>
      ) : (
        <TextField
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          value={minPrice}
          onChange={({ target: { value } }) => setMinPrice(value)}
          variant="outlined"
          label="Minimum price ($1 or more)"
          className={classes.formField}
        />
      )}
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
        onClick={onCreateClicked}
        color="primary"
        variant="contained"
        size="medium"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create'}
      </Button>
    </Grid>
  );
};

export default CreateShowForm;
