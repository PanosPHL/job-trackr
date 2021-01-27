import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import AuthRoute from './components/universal/AuthRoute';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import AuthContext, { Auth } from './contexts/AuthContext';

function App() {
  const [user, setUser] = useState<Auth | null>(null);

  useEffect(() => {
    const fetchCSRF = async () => {
      await fetch('/api/session/csrf/');
    };

    fetchCSRF();
  }, []);

  const value = {
    user,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      <Switch>
        <Route path="/login" component={Login} />
        <AuthRoute path="/" component={Home} />
      </Switch>
    </AuthContext.Provider>
  );
}

export default App;
