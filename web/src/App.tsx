import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import useCurrentUser from 'hooks/useCurrentUser';

import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Header from 'components/Header';
import Footer from 'components/Footer';
import Home from 'screens/Home';
import Watch from 'screens/Watch';
import Dashboard from 'screens/Dashboard';
import EditProfile from 'screens/EditProfile';
import EditShows from 'screens/EditShows';
import Payments from 'screens/Payments';
import LinkStripeAccount from 'screens/LinkStripeAccount';
import AutoLogin from 'screens/AutoLogin';
import Admin from 'screens/Admin';
import EmbeddedPlayer from 'screens/EmbeddedPlayer';
import ProjectOverviewSplash from 'components/ProjectOverviewSplash';

const useStyles = makeStyles(({ spacing }) => ({
  content: {
    minHeight: 800,
  },
  networkError: {
    marginTop: spacing(9),
    padding: spacing(2),
    textAlign: 'center',
  },
}));

function App() {
  const classes = useStyles();

  const [currentUser, { data, error }] = useCurrentUser();

  useEffect(() => {
    // Remove any styles left over from server side rendering
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  if (window.location.pathname.startsWith('/embed')) {
    return <EmbeddedPlayer />;
  }

  //   const isCheckingForCurrentUser = typeof data === 'undefined';
  //   if (isCheckingForCurrentUser) {
  //     return null;
  //   } else if (error) {
  //     return (
  //       <Grid
  //         container
  //         direction="column"
  //         alignItems="center"
  //         className={classes.networkError}
  //       >
  //         <Typography color="error">
  //           Network error - could not reach the backend.
  //           <br />
  //           Please double-check your internet connection and reload the page.
  //         </Typography>
  //       </Grid>
  //     );
  //   }

  return (
    <Router>
      <Header />

      <div className={classes.content}>
        <Switch>
          <Route exact path="/">
            {/* <Home /> */}
            <ProjectOverviewSplash />
          </Route>

          {/* Now that the project is archived, redirect all routes to Home */}
          <Route>
            <Redirect to="/" />
          </Route>

          {/* <Route exact path="/oauth/stripe-connect">
            <LinkStripeAccount />
          </Route>

          <Route exact path="/auto-login/:autoLoginToken">
            <AutoLogin />
          </Route>

          <Route exact path="/admin">
            <Admin />
          </Route>

          {currentUser && (
            <Route path={`/${currentUser.urlSlug}`}>
              <Switch>
                <Route exact path="/:currentUserUrlSlug/edit-profile">
                  <EditProfile />
                </Route>
                <Route exact path="/:currentUserUrlSlug/edit-shows">
                  <EditShows />
                </Route>
                <Route exact path="/:currentUserUrlSlug/payments">
                  <Payments />
                </Route>
                <Route>
                  <Dashboard />
                </Route>
              </Switch>
            </Route>
          )}

          <Route path="/:userUrlSlug">
            <Watch />
          </Route> */}
        </Switch>
      </div>

      <Footer />
    </Router>
  );
}

export default App;
