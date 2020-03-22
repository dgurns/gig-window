import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core';
import theme from 'styles/theme';

const App = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Concert Window</title>
    </Head>
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  </>
);

export default App;
