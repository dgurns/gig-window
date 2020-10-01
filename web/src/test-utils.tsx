import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory, MemoryHistory, State } from "history";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import theme from "styles/theme";

const defaultHistory = createMemoryHistory();

interface RenderWithProvidersOptions {
  history?: MemoryHistory<State>;
  renderOptions?: Omit<RenderOptions, "queries">;
}

const renderWithProviders = (
  ui: JSX.Element,
  { history = defaultHistory, renderOptions = {} }: RenderWithProvidersOptions
) =>
  render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router history={history}>{ui}</Router>
    </ThemeProvider>,
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
