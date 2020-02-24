import React, { useState } from 'react';
import { IconContext } from 'react-icons';
import { FaAngleDoubleDown } from 'react-icons/fa';
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

import './leaveNavbar.css';

export default function LeaveNavbar({ changer }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(!dropdownOpen);
  return (
    <div className="row leaveNavContainer">
      <span className="col left">
        <h4>Leave Management</h4>{' '}
      </span>
      <span className="col ">
        <div className="dropdownTop">
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle className={'menuSizing'} color={'#003366'}>
              Leave Management Submodules{' '}
              <IconContext.Provider
                value={{
                  color: '#003366',
                  size: '2em',
                  className: 'global-class-name'
                }}
              >
                <FaAngleDoubleDown />
              </IconContext.Provider>
            </DropdownToggle>
            <DropdownMenu className="menuSizing">
              <DropdownItem onClick={() => changer('LeaveHome')}>
                Home
              </DropdownItem>
              <DropdownItem onClick={() => changer('Plan4Leave')}>
                Plan For Leave
              </DropdownItem>
              <DropdownItem onClick={() => changer('PlannedLeaves')}>
                Your Planned Leaves
              </DropdownItem>
              <DropdownItem onClick={() => changer('Apply4Leave')}>
                Apply For Leave
              </DropdownItem>
              <DropdownItem onClick={() => changer('LeavesTaken')}>
                Leaves You Have Already Taken
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem header>HR Personnele</DropdownItem>
              <DropdownItem divider />
              <DropdownItem header>Programme Personnele</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </span>
    </div>
  );
}

LeaveNavbar.propTypes = {
  changer: PropTypes.func
};
