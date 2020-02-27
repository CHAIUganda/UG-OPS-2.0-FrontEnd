import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

import * as authActions from '../../../redux/actions/authActions';
import './headerRight.css';

const matchDispatchToProps = {
  logUserOut: authActions.logUserOut
};

const mapStateToProps = () => ({ });

function HeaderRight({ logUserOut }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const logOut = (event) => {
    event.preventDefault();
    Cookies.remove('token');
    logUserOut();
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

  return (
    <div className="headerRight  float-right">
      <span className="name mr-2 mt-2">
        Locust KatoBrendenKlop anotherVeryLongName
      </span>
      <div className="customDropdown  float-right mr-2">
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle tag={'span'}>{returnIcon()}</DropdownToggle>
          <DropdownMenu>
            <DropdownItem>Reset Password</DropdownItem>
            <DropdownItem>Edit My Details</DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={logOut}>Log Out</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}

HeaderRight.propTypes = {
  logUserOut: PropTypes.func
};

export default connect(mapStateToProps, matchDispatchToProps)(HeaderRight);
