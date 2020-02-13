import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// prettier-ignore
import {
  HashRouter,
  Route,
  Switch
} from 'react-router-dom';

import Header from './components/header';
import Sidebar from './components/sidebar';
import Welcome from './components/content/welcome';
import PageNotFound from './components/content/pageNotFound';
import HR from './components/content/hr';
import Auth from './components/content/auth/index';

import './App.css';

const mapStateToProps = (state) => ({
  token: state.auth.token
});

function App(props) {
  const { token } = props;
  return (
    <HashRouter>
      <Header />
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
    </HashRouter>
  );
}

App.propTypes = {
  token: PropTypes.string
};

export default connect(mapStateToProps)(App);
