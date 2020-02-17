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

// import './leaveNavbar.css';

export default function HRSpecificNav({ changer }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(!dropdownOpen);
  return (
    <div className="row leaveNavContainer">
      <span className="col left">
        <h4>HR duties</h4>{' '}
      </span>
      <span className="col ">
        <div className="dropdownTop">
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle className={'menuSizing'} color={'darkblue'}>
              HR Duties Submodules{' '}
              <IconContext.Provider
                value={{
                  color: 'darkblue',
                  size: '2em',
                  className: 'global-class-name'
                }}
              >
                <FaAngleDoubleDown />
              </IconContext.Provider>
            </DropdownToggle>
            <DropdownMenu className="menuSizing">
              <DropdownItem onClick={() => changer('hrHome')}>
                Home
              </DropdownItem>
              <DropdownItem onClick={() => changer('ManagePublicHolidays')}>
              Manage Public Holidays
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </span>
    </div>
  );
}

HRSpecificNav.propTypes = {
  changer: PropTypes.func
};
