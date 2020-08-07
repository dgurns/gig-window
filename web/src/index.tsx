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

const {
  REACT_APP_API_HTTP_ORIGIN,
  REACT_APP_API_WEBSOCKET_ORIGIN,
  REACT_APP_API_GRAPHQL_PATH,
} = process.env;

const httpLink = new HttpLink({
  uri: `${REACT_APP_API_HTTP_ORIGIN}${REACT_APP_API_GRAPHQL_PATH}`,
  credentials: 'include',
});
const wsLink = new WebSocketLink({
  uri: `${REACT_APP_API_WEBSOCKET_ORIGIN}${REACT_APP_API_GRAPHQL_PATH}`,
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
