import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';

interface AuthRouteProps {
  path: string;
  component: React.FC;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ path, component }) => {
  const value = useContext(AuthContext);

  if (value && value.user) {
    return <Route path={path} component={component} />;
  } else {
    return <Redirect to="/login" />;
  }
};

export default AuthRoute;
