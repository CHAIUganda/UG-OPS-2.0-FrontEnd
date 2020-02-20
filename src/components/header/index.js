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
    return (<div className="headerDiv">
      <div className="row">
        <div className="col-4">
          <HeaderLeft />
        </div>
        {/* <div className="col-4">
          <HeaderMiddle />
        </div> */}
        <div className="col-8">
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
