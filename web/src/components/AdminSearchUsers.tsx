import React, { useEffect, useCallback, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useLazyQuery, useMutation, gql } from '@apollo/client';

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
      urlSlug
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

  const [searchTerm, setSearchTerm] = useState('');

  const [
    searchUsers,
    {
      data: searchUsersData,
      loading: searchUsersLoading,
      error: searchUsersError,
      refetch: refetchSearchUsers,
    },
  ] = useLazyQuery<SearchUsersData>(SEARCH_USERS);

  useEffect(() => {
    const debouncedSearch = setTimeout(() => {
      searchUsers({ variables: { searchTerm } });
    }, 600);
    return () => clearTimeout(debouncedSearch);
  }, [searchTerm, searchUsers]);

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
  const emptyResults =
    !searchUsersLoading && searchUsersData && userResults.length === 0;

  return (
    <Grid container direction="column">
      <TextField
        value={searchTerm}
        onChange={({ target: { value } }) => setSearchTerm(value)}
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
      {emptyResults && (
        <Typography color="secondary">No users found</Typography>
      )}
      {userResults.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography>ID</Typography>
              </TableCell>
              <TableCell align="left">
                <Typography>Username</Typography>
              </TableCell>
              <TableCell align="left">
                <Typography>Email</Typography>
              </TableCell>
              <TableCell align="left">
                <Typography>URL</Typography>
              </TableCell>
              <TableCell align="left" className={classes.actionsColumn}>
                <Typography>Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userResults.map((user) => (
              <TableRow key={user.id}>
                <TableCell component="th" scope="row">
                  <Typography>{user.id}</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography>{user.username}</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography>{user.email}</Typography>
                </TableCell>
                <TableCell align="left">
                  <Link component={RouterLink} to={user.urlSlug}>
                    /{user.urlSlug}
                  </Link>
                </TableCell>
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
