import React, { useState } from 'react';
import {
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

import './notifications.css';

function Notifications() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const returnDropdown = () => (
    <Dropdown tag={'span'} isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle tag={'span'}>
        <span className='pr-1'>notifications</span>
        <Badge color="info">5</Badge>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem header>Header</DropdownItem>
        <DropdownItem>Some Action</DropdownItem>
        <DropdownItem disabled>Action (disabled)</DropdownItem>
        <DropdownItem divider />
        <DropdownItem>Foo Action</DropdownItem>
        <DropdownItem>Bar Action</DropdownItem>
        <DropdownItem>Quo Action</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
  return (
    <span className="name mr-5 mt-2 pointerCursor">
      {returnDropdown()}
    </span>
  );
}

export default Notifications;
