import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, isVendorRoute, ...rest }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAllowed = user && isVendorRoute ? user?.isVendor : true;

  return (
    <Route
      {...rest}
      render={(props) =>
        isAllowed ? <Component {...props} /> : <Redirect to='/login' />
      }
    />
  );
};

export default PrivateRoute;
