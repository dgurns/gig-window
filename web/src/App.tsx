import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import useCurrentUser from 'hooks/useCurrentUser';

import Header from 'components/Header';
import Home from 'screens/Home';
import Watch from 'screens/Watch';
import Dashboard from 'screens/Dashboard';
import LinkStripeAccount from 'screens/LinkStripeAccount';

function App() {
  const [currentUser] = useCurrentUser();

  useEffect(() => {
    // Remove any styles left over from server side rendering
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/oauth/stripe-connect">
          <LinkStripeAccount />
        </Route>
        <Route
          path="/:userUrlSlug"
          render={({ match: { params } }) => {
            const isCurrentUserDashboard =
              currentUser?.urlSlug === params.userUrlSlug;
            return isCurrentUserDashboard ? <Dashboard /> : <Watch />;
          }}
        ></Route>
      </Switch>
    </Router>
  );
}

export default App;
