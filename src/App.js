import React from 'react';
// import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  // HashRouter,
  Route,
  // Switch
  BrowserRouter as Router
} from 'react-router-dom';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';

import Header from './components/header';
import Sidebar from './components/sidebar';
import Welcome from './components/content/welcome';
import PageNotFound from './components/content/pageNotFound';
import HR from './components/content/hr';
import Procurement from './components/content/procurement';
import Auth from './components/content/auth/index';

// import * as authActions from './redux/actions/authActions';
// import * as notificationActions from './redux/actions/notificationsActions';
import oktaConfig from './oktaConf';

import './App.css';

function App() {
  return (
    <>
      <Router>
        <Security {...oktaConfig.oidc}>
          <Header />
          <div className="row">
            <Sidebar />
            {/* <Switch> */}
            {/* {!token && (
            <Route
              path="/"
              render={(Routerprops) => <Auth {...Routerprops} isAuthed={false} />}
            />
          )} */}
            <Route exact path="/" component={Welcome} />
            <Route path="/implicit/callback" component={LoginCallback} />
            {/* OKTA SECURE */}
            <SecureRoute path="/hr/:componentToRender" component={HR} />
            <SecureRoute path="/procurement/:componentToRender" component={Procurement} />
            <SecureRoute path="/auth/:componentToRender" component={Auth} />
            <SecureRoute component={PageNotFound} />
            {/* <Route component={Welcome} /> */}
            {/* </Switch> */}
          </div>
        </Security>
      </Router>
    </>
  );
}

App.propTypes = {
  token: PropTypes.string,
  logUserIn: PropTypes.func,
  setInitialNotifications: PropTypes.func,
  AddNotification: PropTypes.func
};

export default App;
