import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

import Auth from './components/pages/Auth';

function App() {
  const location = useLocation();

  return (
    <Switch location={location} key={location.pathname}>
      {/* <Route exact path='/'>
        <Home />
      </Route> */}
      <Route exact path='/login-register'>
        <Auth />
      </Route>
      {/* <PrivateRoute exact path='/orders/' component={Orders} />
      <Route exact path='/album/' component={Album} />
      <Route>
        <Home />
      </Route> */}
    </Switch>
  );
}

export default App;
