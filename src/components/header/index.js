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
    return (<div className="headerDiv mt-3">
      <div className="row">
        <div className="col-sm-4 green">
          <HeaderLeft />
        </div>
        <div className="col-sm-4 green">
          <HeaderMiddle />
        </div>
        <div className="col-sm-4 green2">
          <HeaderRight />
        </div>
      </div>
    </div>);
  }
  return (
    <div className="headerDiv">
      <HeaderLeft />
      <div className='MiddleAndRightHeaderContainer'>
        <HeaderMiddle />
        <HeaderRight />
      </div>
    </div>
  );
}

Header.propTypes = {
  token: PropTypes.string
};

export default connect(mapStateToProps)(Header);
