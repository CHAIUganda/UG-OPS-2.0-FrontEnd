import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import HeaderLeft from './headerLeft';
import HeaderMiddle from './headerMiddle';
import HeaderRight from './headerRight';
import './header.css';

const mapStateToProps = (state) => ({
  token: state.auth.token
});

function Header({ token }) {
  if (token) {
    return (<div className="headerDiv pt-3">
      <div className="row">
        <div className="col-sm-1">
          <HeaderLeft />
        </div>
        <div className="col-sm-6 text-right">
          <HeaderMiddle />
        </div>
        <div className="col-sm-5">
          <HeaderRight />
        </div>
      </div>
    </div>);
  }
  return (<div className="headerDiv pt-3">
    <div className="row">
      <div className="col-sm-1">
        <HeaderLeft />
      </div>
      <div className="col-sm-6 text-right invisible">
        <HeaderMiddle />
      </div>
      <div className="col-sm-5 invisible">
        <HeaderRight />
      </div>
    </div>
  </div>);
}

Header.propTypes = {
  token: PropTypes.string
};

export default connect(mapStateToProps)(Header);
