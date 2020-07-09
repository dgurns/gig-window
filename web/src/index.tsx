import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  HttpLink,
  split,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/link-ws';
import { ThemeProvider, CssBaseline } from '@material-ui/core';

import theme from 'styles/theme';
import * as serviceWorker from './serviceWorker';
import App from 'App';

const { NODE_ENV, REACT_APP_API_GRAPHQL_PATH } = process.env;
const { host } = window.location;

const graphqlHttpUri =
  NODE_ENV === 'development'
    ? `http://localhost:4000${REACT_APP_API_GRAPHQL_PATH}`
    : REACT_APP_API_GRAPHQL_PATH;
const graphqlWsUri =
  NODE_ENV === 'development'
    ? `ws://localhost:4000${REACT_APP_API_GRAPHQL_PATH}`
    : `ws://${host}${REACT_APP_API_GRAPHQL_PATH}`;

const httpLink = new HttpLink({
  uri: graphqlHttpUri,
  credentials: 'include',
});
const wsLink = new WebSocketLink({
  uri: graphqlWsUri,
  options: {
    reconnect: true,
    timeout: 3000,
  },
});
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
