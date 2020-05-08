import React, { useState } from 'react';
import {
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { AiOutlineNotification } from 'react-icons/ai';

import Icon from '../icon';
import './notifications.css';

const mapStateToProps = (state) => ({
  notifications: state.notifications,
});

function Notifications({ notifications }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const returnDropdown = () => (
    <Dropdown tag={'span'} isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle tag={'span'}>
        <span className='pr-1'>notifications</span>
        <Badge color="info">{notifications.length}</Badge>
      </DropdownToggle>
      <DropdownMenu>
        {
          notifications.map((not) => (
            <>
              <DropdownItem key={not._id}>
                <Icon
                  Icon2Render={AiOutlineNotification}
                  color={'#003366'}
                />
                {not.title}
              </DropdownItem>
              <DropdownItem divider />
            </>
          ))
        }
      </DropdownMenu>
    </Dropdown>
  );
  return (
    <span className="name mr-5 mt-2 pointerCursor">
      {returnDropdown()}
    </span>
  );
}


Notifications.propTypes = {
  notifications: PropTypes.array,
};

export default connect(mapStateToProps)(Notifications);
