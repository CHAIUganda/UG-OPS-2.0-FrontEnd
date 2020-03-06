import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// prettier-ignore
import {
  HashRouter,
  Route,
  Switch
} from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import Header from './components/header';
import Sidebar from './components/sidebar';
import Welcome from './components/content/welcome';
import PageNotFound from './components/content/pageNotFound';
import HR from './components/content/hr';
import Auth from './components/content/auth/index';

import * as authActions from './redux/actions/authActions';
import { BASE_URL } from './config';
import CommonSpinner from './components/common/spinner';
import './App.css';

const mapStateToProps = (state) => ({
  token: state.auth.token
});

const matchDispatchToProps = {
  logUserIn: authActions.logUserIn
};

function App({ token, logUserIn }) {
  const [spinner, setSpinner] = useState(false);

  const setUpUser = (tokenToSet) => {
    axios.defaults.headers.common = { token: tokenToSet };
    const apiRoute = `${BASE_URL}auth/getLoggedInUser`;
    axios.get(apiRoute)
      . then((res) => {
        const {
          department,
          fName,
          gender,
          internationalStaff,
          lName,
          position,
          email,
          _id,
          leaveDetails,
          supervisor
        } = res.data;

        const userObject = {
          ...res.data,
          email,
          token: tokenToSet,
          gender,
          internationalStaff,
          department,
          firstName: fName,
          lastName: lName,
          Position: position,
          id: _id,
          leaveDetails,
          supervisor
        };
        logUserIn(userObject);
        setSpinner(false);
      })
      .catch(() => {
        setSpinner(false);
        Cookies.remove('token');
      });
  };

  useEffect(() => {
    if (!token) {
      const CookieToken = Cookies.get('token');
      if (CookieToken) {
        setSpinner(true);
        setUpUser(CookieToken);
      }
    }
  }, []);

  if (spinner) {
    return (
      <div className="alert alert-info text-center" role="alert">
        <div><CommonSpinner /></div>
        <p>Getting things ready.....</p>
      </div>
    );
  }

  return (
    <HashRouter>
      <Header />
      <div className="row">
        <Sidebar />
        <Switch>
          {!token && (
            <Route
              path="/"
              render={(Routerprops) => <Auth {...Routerprops} isAuthed={false} />}
            />
          )}
          <Route exact path="/" component={Welcome} />
          <Route path="/hr/:componentToRender" component={HR} />
          <Route exact path="/auth/:componentToRender" component={Auth} />

          <Route component={Welcome} />
          <Route component={PageNotFound} />
        </Switch>
      </div>
    </HashRouter>
  );
}

App.propTypes = {
  token: PropTypes.string,
  logUserIn: PropTypes.func
};

export default connect(mapStateToProps, matchDispatchToProps)(App);
