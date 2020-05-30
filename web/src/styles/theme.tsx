import { createMuiTheme } from '@material-ui/core/styles';
import { deepOrange, grey, amber, green, red } from '@material-ui/core/colors';

export default createMuiTheme({
  palette: {
    primary: {
      main: deepOrange[700],
    },
    secondary: {
      main: grey[500],
    },
    error: {
      main: red[800],
    },
    warning: {
      main: amber[500],
    },
    info: {
      main: grey[500],
    },
    success: {
      main: green[500],
    },
    common: {
      black: grey[900],
      white: grey[50],
    },
    text: {
      primary: grey[900],
      secondary: grey[500],
    },
    action: {
      active: deepOrange[700],
      disabledOpacity: 0.2,
    },
    background: {
      default: grey[300],
    },
  },
  typography: {
    fontFamily: ['Lato', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 7,
        fontSize: '1rem',
        minWidth: 0,
        textTransform: 'none',
      },
      text: {
        color: deepOrange[700],
        padding: 0,
        '&:hover': {
          backgroundColor: 'transparent',
          textDecoration: 'underline',
        },
      },
      sizeSmall: {
        fontSize: '1rem',
        padding: '0 20px',
      },
      sizeLarge: {
        fontSize: '1rem',
        fontWeight: 'bold',
        padding: '15px 30px',
      },
    },
    MuiCard: {
      root: {
        borderRadius: 0,
      },
    },
    MuiDialog: {
      paper: {
        margin: 10,
      },
    },
    MuiInputBase: {
      input: {
        fontSize: '1rem',
      },
    },
    MuiLink: {
      root: {
        fontSize: '1rem',
      },
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: 8,
      },
      inputMarginDense: {
        paddingBottom: 10,
        paddingTop: 10,
      },
      multiline: {
        padding: '13px 14px',
      },
    },
    MuiPaper: {
      elevation1: {
        boxShadow:
          '0px 2px 1px -1px rgba(0,0,0,0.05), 0px 1px 1px 0px rgba(0,0,0,0.05), 0px 1px 3px 0px rgba(0,0,0,0.05)',
      },
      elevation3: {
        boxShadow:
          '0px 3px 3px -2px rgba(0,0,0,0.1), 0px 3px 4px 0px rgba(0,0,0,0.07), 0px 1px 8px 0px rgba(0,0,0,0.06)',
      },
    },
    MuiTypography: {
      root: {
        fontSize: '1rem',
      },
    },
  },
});
