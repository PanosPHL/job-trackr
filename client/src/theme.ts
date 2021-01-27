import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Lato, Helvetica',
    fontSize: 14,
  },
  palette: {
    type: 'dark',
    primary: {
      main: '#424242',
      dark: '#242424',
    },
    secondary: {
      main: '#486581',
    },
  },
});

theme.typography.h3 = {
  fontSize: '3rem',
  fontWeight: 400,
  lineHeight: 1.167,
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.5rem',
  },
};

export default theme;
