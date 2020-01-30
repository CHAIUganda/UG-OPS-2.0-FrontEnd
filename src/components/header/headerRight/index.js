import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

import './headerRight.css';

export default function HeaderRight() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const returnIcon = () => (
    <IconContext.Provider
      value={{
        color: 'darkblue',
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
    <div className="inlineHeader headerRight">
      <span className="name">
        AbelChrisAlexAndrewPaulGreen Oboth anotherVeryLongName
      </span>
      <div className="customDropdown">
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle tag={'span'}>{returnIcon()}</DropdownToggle>
          <DropdownMenu>
            <DropdownItem>Reset Password</DropdownItem>
            <DropdownItem>another option</DropdownItem>
            <DropdownItem divider />
            <DropdownItem>Log Out</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
