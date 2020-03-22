import { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider, CssBaseline } from '@material-ui/core';
import theme from 'styles/theme';

import Header from 'components/Header';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>Concert Window</title>
    </Head>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Component {...pageProps} />
    </ThemeProvider>
  </>
);

export default MyApp;
