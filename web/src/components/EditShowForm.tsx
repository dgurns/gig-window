import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import DatePicker from 'react-datepicker';

import { Grid, Typography, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import 'react-datepicker/dist/react-datepicker.css';

interface EditShowFormProps {
  show: {
    id: number;
    title?: string;
    showtimeInUtc: string;
  };
  onSuccess?: () => void;
}

const UPDATE_SHOW = gql`
  mutation UpdateShow(
    $id: Int!
    $updatedTitle: String
    $updatedShowtime: String!
  ) {
    updateShow(
      data: { id: $id, title: $updatedTitle, showtimeInUtc: $updatedShowtime }
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

const EditShowForm = (props: EditShowFormProps) => {
  const {
    show: { id, title, showtimeInUtc },
    onSuccess,
  } = props;

  const classes = useStyles();
  const [updateShow, { loading, data, error }] = useMutation(UPDATE_SHOW, {
    errorPolicy: 'all',
  });

  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedShowtime, setUpdatedShowtime] = useState(
    new Date(showtimeInUtc)
  );
  const [localValidationError, setLocalValidationError] = useState('');

  useEffect(() => {
    if (data?.updateShow.id) {
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [data, onSuccess]);

  const onSaveClicked = () => {
    setLocalValidationError('');
    if (!updatedTitle || !updatedShowtime) {
      return setLocalValidationError('Please fill out all the fields');
    } else if (new Date() > updatedShowtime) {
      return setLocalValidationError('Showtime must be in the future');
    }
    updateShow({
      variables: {
        id: id,
        updatedTitle,
        updatedShowtime: updatedShowtime.toISOString(),
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
