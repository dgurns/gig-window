import React from 'react';
import ReactDOM from 'react-dom';
import env from '@beam-australia/react-env';
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

const graphqlHttpUri =
  env('NODE_ENV') === 'development'
    ? `http://localhost:4000${env('API_GRAPHQL_PATH')}`
    : env('API_GRAPHQL_PATH');
const graphqlWsUri =
  env('NODE_ENV') === 'development'
    ? `ws://localhost:4000${env('API_GRAPHQL_PATH')}`
    : `ws://${window.location.host}${env('API_GRAPHQL_PATH')}`;

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
