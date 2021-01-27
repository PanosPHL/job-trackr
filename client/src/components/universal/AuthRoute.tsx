import React, { useContext } from 'react';
import { Route, Redirect, useParams } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';

interface AuthRouteProps {
  path: string;
  component: React.FC;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ path, component }) => {
  const value = useContext(AuthContext);
  const params = useParams();

  if (value && value.user && params) {
    return <Route path={path} component={component} />;
  } else {
    return <Redirect to="/login" />;
  }
};

export default AuthRoute;
