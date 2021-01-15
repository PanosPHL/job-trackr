import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import AuthRoute from './components/universal/AuthRoute';
import Home from './components/pages/Home';
import Login from './components/pages/Login';

function App() {
  useEffect(() => {
    const fetchCSRF = async () => {
      await fetch('/api/session/csrf/');
    };

    fetchCSRF();
  }, []);

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <AuthRoute path="/" component={Home} />
    </Switch>
  );
}

export default App;
