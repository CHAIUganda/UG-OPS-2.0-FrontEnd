import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

import Notifications from '../../common/notifications';
import * as authActions from '../../../redux/actions/authActions';
import './headerRight.css';

const matchDispatchToProps = {
  logUserOut: authActions.logUserOut
};

const mapStateToProps = (state) => ({
  firstName: state.auth.firstName,
  lastName: state.auth.lastName
});

function HeaderRight({
  logUserOut,
  firstName,
  lastName,
  loginButton
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { authService } = useOktaAuth();

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const login = async () => {
    authService.login('/');
  };

  const logOut = (event) => {
    event.preventDefault();
    Cookies.remove('token');
    logUserOut();
    authService.logout('/');
  };

  const returnIcon = () => (
    <IconContext.Provider
      value={{
        color: '#003366',
        size: '2em',
        className: 'global-class-name'
      }}
    >
      <span className="userIcon">
        <FaUserCircle />
      </span>
    </IconContext.Provider>
  );

  if (loginButton) {
    return (
      <div className="headerRight  float-right">
        <button className="submitButton mr-4" type="submit" onClick={login}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="headerRight  float-right">
      <Notifications />
      <span className="name mr-2 mt-2">
        {`${firstName} ${lastName[0]}.`}
      </span>
      <div className="float-right mr-2">
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle tag={'span'}>{returnIcon()}</DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>{`${firstName} ${lastName}`}</DropdownItem>
            <Link to='/auth/ViewMyDetails'><DropdownItem>View My Details</DropdownItem></Link>
            <DropdownItem divider />
            <DropdownItem onClick={logOut}>Log Out</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}

HeaderRight.propTypes = {
  logUserOut: PropTypes.func,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  loginButton: PropTypes.bool
};

export default connect(mapStateToProps, matchDispatchToProps)(HeaderRight);
