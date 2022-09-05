import React from "react";
import { Redirect, Route } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const authorized = localStorage.getItem("token");

  return (
    <Route
      {...rest}
      render={
        (props) => (authorized ? <Component {...props} /> : <Redirect to="/login" />)
      }
    />
  );
};

export default ProtectedRoute;
