import React from 'react';
import { render } from 'react-dom';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'

import App from './components/App/App';
import NotFound from './components/App/NotFound';
import MainPage from './components/MainPage/MainPage'
import PrivateRoute from './components/PrivateRoute/PrivateRoute'

import './styles/styles.scss';
import MyHome from './components/MyHome/MyHome';
import UserProfile from './components/UserProfile/UserProfile';
import UserNotFound from './components/UserProfile/UserNotFound';
import CreatePost from './components/CreatePost/CreatePost';


render((
  <Router>
    <App>
      <Switch>
        <Route exact path="/" component={MyHome}/>
        <PrivateRoute exact path="/main" component={MainPage} />
        <PrivateRoute exact path="/users/:username" component={UserProfile} />
        <PrivateRoute exact path="/main/post" component={CreatePost} />
        <PrivateRoute path="/notfounduser" component={UserNotFound} />
        <Route component={NotFound}/>
      </Switch>
    </App>
  </Router>
), document.getElementById('app'));
