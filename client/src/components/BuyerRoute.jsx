import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const BuyerRoute = ({ component: Component, ...rest }) => {
  const authorized = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <Route
      {...rest}
      render={(props) =>
        authorized && role == 'buyer' ? (
          <Component {...props} />
        ) : (
          <Redirect to='/login' />
        )
      }
    />
  );
};

export default BuyerRoute;
