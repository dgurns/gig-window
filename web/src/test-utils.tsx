import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory, MemoryHistory, State } from "history";
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

const mockHttpLink = new HttpLink({
  uri: "http://test.com/graphql",
  credentials: "include",
});
const mockWsLink = new WebSocketLink({
  uri: "ws://test.com/graphql",
  options: {
    reconnect: true,
  },
});
const mockSplitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  mockWsLink,
  mockHttpLink
);
const createMockApolloClient = () =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link: mockSplitLink,
  });

const defaultHistory = createMemoryHistory();

interface RenderWithProvidersOptions {
  history?: MemoryHistory<State>;
  renderOptions?: Omit<RenderOptions, "queries">;
}

const renderWithProviders = (
  ui: JSX.Element,
  {
    history = defaultHistory,
    renderOptions = {},
  }: RenderWithProvidersOptions = {}
) =>
  render(
    <React.StrictMode>
      <ApolloProvider client={createMockApolloClient()}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router history={history}>{ui}</Router>
        </ThemeProvider>
      </ApolloProvider>
    </React.StrictMode>,
    { ...renderOptions }
  );

// re-export everything
export * from "@testing-library/react";

// override render method
export {
  renderWithProviders as render,
  render as renderWithoutProviders,
  defaultHistory as history,
};
