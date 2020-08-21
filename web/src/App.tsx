import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import useCurrentUser from 'hooks/useCurrentUser';

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

const useStyles = makeStyles(() => ({
  content: {
    minHeight: 800,
  },
}));

function App() {
  const classes = useStyles();

  const [currentUser] = useCurrentUser();

  useEffect(() => {
    // Remove any styles left over from server side rendering
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const currentUserUrlSlug = currentUser?.urlSlug;

  return (
    <Router>
      <Header />

      <div className={classes.content}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <Route exact path="/oauth/stripe-connect">
            <LinkStripeAccount />
          </Route>

          <Route path={`/${currentUserUrlSlug}`}>
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

          <Route path="/:userUrlSlug">
            <Watch />
          </Route>
        </Switch>
      </div>

      <Footer />
    </Router>
  );
}

export default App;
