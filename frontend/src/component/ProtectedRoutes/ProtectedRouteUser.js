import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const ProtectedRouteUser = ({ component: Component, ...rest }) => {
  const { loading, isAuthenticated } = useSelector((state) => state.sessionSlice);

  return (
    <Fragment>
      {loading === false && (
        <Route
          {...rest}
          render={(props) => {
            if (isAuthenticated === false) {
              return <Redirect to="/login" />;
            }
            return <Component {...props} />;
          }}
        />
      )}
    </Fragment>
  );
};

export default ProtectedRouteUser;
