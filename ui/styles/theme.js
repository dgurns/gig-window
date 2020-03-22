import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    // Raw colors
    black: '#030303',
    green: '#44DB5E',
    grey: '#9A9A9A',
    orange: '#FE3824',
    red: '#FF333D',
    white: '#DEDCDC',
    yellow: '#FFCD00',
    // Intention colors
    primary: {
      main: '#FE3824'
    },
    secondary: {
      main: '#9A9A9A'
    },
    error: {
      main: '#FF333D'
    },
    warning: {
      main: '#FFCD00'
    },
    info: {
      main: '#9A9A9A'
    },
    success: {
      main: '#44DB5E'
    }
  },
  typography: {
    fontFamily: ['Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(',')
  }
});
