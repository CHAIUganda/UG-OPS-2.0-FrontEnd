import React from 'react';
import PropTypes from 'prop-types';

import { MdPerson } from 'react-icons/md';
import { FaPlaneDeparture, FaFileContract, FaTractor } from 'react-icons/fa';

import SubItem from '../subItem';

export default function HR() {
  return (
    <div>
      <p className="sidebTopNav">
        <FaPlaneDeparture /> Leave
      </p>
      <div className='showContent'>
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
