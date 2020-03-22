import { createMuiTheme } from '@material-ui/core/styles';
import { deepOrange, grey, amber, green, red } from '@material-ui/core/colors';

export default createMuiTheme({
  palette: {
    primary: {
      main: deepOrange[700]
    },
    secondary: {
      main: grey[500]
    },
    error: {
      main: red[800]
    },
    warning: {
      main: amber[500]
    },
    info: {
      main: grey[500]
    },
    success: {
      main: green[500]
    },
    common: {
      black: grey[900],
      white: grey[50]
    },
    text: {
      primary: grey[900],
      secondary: grey[500]
    },
    action: {
      active: deepOrange[700],
      disabledOpacity: 0.2
    },
    background: {
      default: grey[300]
    }
  },
  typography: {
    fontFamily: ['Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(',')
  }
});
