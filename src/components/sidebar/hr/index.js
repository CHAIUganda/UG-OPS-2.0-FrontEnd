import React from 'react';
import PropTypes from 'prop-types';

import { IoIosPeople } from 'react-icons/io';
import { MdPerson } from 'react-icons/md';
import { FaPlaneDeparture, FaFileContract, FaTractor } from 'react-icons/fa';

import Arrow from '../arrow';
import Icon from '../icon';
import SubItem from '../subItem';

export default function HR(props) {
  const { toggle, onClick } = props;
  return (
    <div>
      <p onClick={onClick} className="sidebTopNav">
        <Icon icon={() => <IoIosPeople />} />
        Human Resource
        <Arrow toggle={toggle} />
      </p>
      <div
        className={`sidebarDropdownContent ${
          toggle ? 'showContent' : 'dntShowContent'
        }`}
      >
        <SubItem
          link="/hr/LeaveManagement"
          IcontoSet={FaPlaneDeparture}
          textToSet="Leave Management"
        />

        <SubItem
          link="/hr/ContractRenewal"
          IcontoSet={FaFileContract}
          textToSet="Contract Management"
        />

        <SubItem
          link="/hr/WorkPermitRenewal"
          IcontoSet={FaTractor}
          textToSet="Work Permit Management"
        />

        <SubItem
          link="/hr/HRSpecific"
          IcontoSet={MdPerson}
          textToSet="HR"
        />
      </div>
    </div>
  );
}

HR.propTypes = {
  toggle: PropTypes.bool,
  onClick: PropTypes.func
};
