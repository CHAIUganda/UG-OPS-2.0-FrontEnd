/* eslint-disable arrow-body-style */
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
import { Link } from 'react-router-dom';

import Icon from '../icon';
import './notifications.css';

const mapStateToProps = (state) => ({
  notifications: state.notifications,
});

function Notifications({ notifications }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const handleMarkAsRead = (notificationId) => {
    console.log(notificationId);
  };

  const returnNotificationItems = () => {
    const addLinkToNotification = (notification) => {
      if (notification.linkTo) {
        return (
          <Link to={notification.linkTo}>
            <DropdownItem key={notification._id}>
              <Icon
                Icon2Render={AiOutlineNotification}
                color={'#003366'}
              />
              {notification.title}
            </DropdownItem>
          </Link>
        );
      }
      return (
        <DropdownItem key={notification._id}>
          <Icon
            Icon2Render={AiOutlineNotification}
            color={'#003366'}
          />
          {notification.title}
          <button type="button" onClick={() => handleMarkAsRead(notification._id)} className="btn btn-outline-info btn-sm ml-1">
            Mark as read
          </button>
        </DropdownItem>
      );
    };

    return notifications.map((not) => (
      <>
        { addLinkToNotification(not) }
        <DropdownItem divider />
      </>
    ));
  };

  const returnDropdown = () => (
    <Dropdown tag={'span'} isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle tag={'span'}>
        <span className='pr-1'>Notifications</span>
        <Badge color="info">{notifications.length}</Badge>
      </DropdownToggle>
      <DropdownMenu>
        { returnNotificationItems() }
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
