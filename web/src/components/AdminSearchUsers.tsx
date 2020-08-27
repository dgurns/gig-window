import React, { useEffect, useCallback } from 'react';
import { useLazyQuery, useMutation, gql } from '@apollo/client';
import debounce from 'lodash/debounce';

import {
  Grid,
  Typography,
  Link,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { User } from 'types';

interface SearchUsersData {
  searchUsers: User[];
}

const SEARCH_USERS = gql`
  query SearchUsers($searchTerm: String!) {
    searchUsers(searchTerm: $searchTerm) {
      id
      username
      email
      isAllowedToStream
    }
  }
`;

const UPDATE_USER_IS_ALLOWED_TO_STREAM = gql`
  mutation UPDATE_USER_IS_ALLOWED_TO_STREAM(
    $userId: Int!
    $isAllowedToStream: Boolean!
  ) {
    updateUserIsAllowedToStream(
      userId: $userId
      isAllowedToStream: $isAllowedToStream
    ) {
      id
      username
    }
  }
`;

const useStyles = makeStyles(({ spacing }) => ({
  searchField: {
    marginBottom: spacing(3),
  },
  actionsColumn: {
    minWidth: 160,
  },
}));

const AdminSearchUsers = () => {
  const classes = useStyles();

  const [
    searchUsers,
    {
      data: searchUsersData,
      loading: searchUsersLoading,
      error: searchUsersError,
      refetch: refetchSearchUsers,
    },
  ] = useLazyQuery<SearchUsersData>(SEARCH_USERS);

  const onChangeSearchTerm = debounce((searchTerm: string) => {
    if (searchTerm) {
      searchUsers({ variables: { searchTerm } });
    }
  }, 600);

  const [
    updateUserIsAllowedToStream,
    { loading: isAllowedToStreamLoading, error: isAllowedToStreamError },
  ] = useMutation(UPDATE_USER_IS_ALLOWED_TO_STREAM, {
    errorPolicy: 'all',
  });

  const onIsAllowedToStreamClicked = useCallback(
    async (user: User) => {
      await updateUserIsAllowedToStream({
        variables: {
          userId: user.id,
          isAllowedToStream: !user.isAllowedToStream,
        },
      });
      if (refetchSearchUsers) {
        refetchSearchUsers();
      }
    },
    [updateUserIsAllowedToStream, refetchSearchUsers]
  );

  useEffect(() => {
    if (isAllowedToStreamError) {
      window.alert('Error updating user isAllowedToStream status');
    }
  }, [isAllowedToStreamError]);

  const userResults = searchUsersData?.searchUsers ?? [];

  return (
    <Grid container direction="column">
      <TextField
        onChange={({ target: { value } }) => onChangeSearchTerm(value)}
        variant="outlined"
        label="Search for username..."
        className={classes.searchField}
      />
      {searchUsersLoading && (
        <Typography color="secondary">Loading...</Typography>
      )}
      {searchUsersError && (
        <Typography color="error">
          Error: {searchUsersError.graphQLErrors[0].message}
        </Typography>
      )}
      {searchUsersData && userResults.length === 0 && (
        <Typography color="secondary">No users found</Typography>
      )}
      {userResults.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="left">Username</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left" className={classes.actionsColumn}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userResults.map((user) => (
              <TableRow key={user.id}>
                <TableCell component="th" scope="row">
                  {user.id}
                </TableCell>
                <TableCell align="left">{user.username}</TableCell>
                <TableCell align="left">{user.email}</TableCell>
                <TableCell align="left" className={classes.actionsColumn}>
                  {isAllowedToStreamLoading || searchUsersLoading ? (
                    <Typography color="secondary">Loading...</Typography>
                  ) : (
                    <Link
                      component="a"
                      href="#"
                      onClick={() => onIsAllowedToStreamClicked(user)}
                    >
                      {user.isAllowedToStream
                        ? 'Disallow to stream'
                        : 'Allow to stream'}
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Grid>
  );
};

export default AdminSearchUsers;
