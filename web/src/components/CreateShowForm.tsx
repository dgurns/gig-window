import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import DatePicker from 'react-datepicker';

import { Grid, Typography, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import 'react-datepicker/dist/react-datepicker.css';

import DateTime from 'services/DateTime';

interface CreateShowFormProps {
  onSuccess?: () => void;
}

const CREATE_SHOW = gql`
  mutation CreateShow($title: String, $showtimeInUtc: String!) {
    createShow(data: { title: $title, showtimeInUtc: $showtimeInUtc }) {
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

const CreateShowForm = (props: CreateShowFormProps) => {
  const { onSuccess } = props;

  const classes = useStyles();
  const [createShow, { loading, data, error }] = useMutation(CREATE_SHOW, {
    errorPolicy: 'all',
  });

  const [title, setTitle] = useState('');
  const [showtime, setShowtime] = useState(DateTime.createDefaultShowtime());
  const [localValidationError, setLocalValidationError] = useState('');

  useEffect(() => {
    if (data?.createShow.id) {
      setTitle('');
      setShowtime(DateTime.createDefaultShowtime());

      if (onSuccess) {
        onSuccess();
      }
    }
  }, [data, onSuccess]);

  const onCreateClicked = () => {
    setLocalValidationError('');
    if (!title || !showtime) {
      return setLocalValidationError('Please fill out all the fields');
    } else if (new Date() > showtime) {
      return setLocalValidationError('Showtime must be in the future');
    }
    createShow({ variables: { title, showtimeInUtc: showtime.toISOString() } });
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
        onChange={(date) => (date ? setShowtime(date) : null)}
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
