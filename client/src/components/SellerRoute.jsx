import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const SellerRoute = ({ component: Component, ...rest }) => {
  const authorized = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <Route
      {...rest}
      render={(props) =>
        authorized && role == 'seller' ? (
          <Component {...props} />
        ) : (
          <Redirect to='/login' />
        )
      }
    />
  );
};

export default SellerRoute;
