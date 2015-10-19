import React from 'react';
import { Route } from 'react-router';
import App from './containers/App.jsx';
import LoginPage from './containers/Login.jsx';
// import SignUpPage from './containers/Signup.jsx';

export default (
  <Route path="/" component={App} >
    <Route path="login" component={LoginPage} />
  </Route>
);
