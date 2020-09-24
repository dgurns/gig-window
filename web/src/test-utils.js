import React from 'react';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { MockedProvider } from '@apollo/client/testing';
import { ThemeProvider, CssBaseline } from '@material-ui/core';
import theme from 'styles/theme';

const defaultHistory = createMemoryHistory();

const renderWithProviders = (
  ui,
  { mocks = [], history = defaultHistory, renderOptions = {} }
) =>
  render(
    <MockedProvider mocks={mocks}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router history={history}>{ui}</Router>
      </ThemeProvider>
    </MockedProvider>,
    { ...renderOptions }
  );

// re-export everything
export * from '@testing-library/react';

// override render method
export {
  renderWithProviders as render,
  render as renderWithoutProviders,
  defaultHistory as history,
};
