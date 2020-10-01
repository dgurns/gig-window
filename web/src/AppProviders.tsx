import React from "react";
import {
  ApolloClient,
  HttpLink,
  split,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { ThemeProvider, CssBaseline } from "@material-ui/core";

import theme from "styles/theme";

const {
  REACT_APP_API_HTTP_ORIGIN,
  REACT_APP_API_WEBSOCKET_ORIGIN,
  REACT_APP_API_GRAPHQL_PATH,
} = process.env;

const httpLink = new HttpLink({
  uri: `${REACT_APP_API_HTTP_ORIGIN}${REACT_APP_API_GRAPHQL_PATH}`,
  credentials: "include",
});
const wsLink = new WebSocketLink({
  uri: `${REACT_APP_API_WEBSOCKET_ORIGIN}${REACT_APP_API_GRAPHQL_PATH}`,
  options: {
    reconnect: true,
  },
});
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
});

interface AppProvidersProps {
  children: JSX.Element | null;
}

const AppProviders = (props: AppProvidersProps) => (
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {props.children}
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>
);

export default AppProviders;
