import React from 'react';
import { Route, Redirect } from 'react-router-dom';

interface AuthRouteProps {
  path: string;
  component: React.FC;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ path, component }) => {
  const isLoggedIn: Boolean = false;

  if (isLoggedIn) {
    return <Route path={path} component={component} />;
  } else {
    return <Redirect to="/login" />;
  }
};

export default AuthRoute;
