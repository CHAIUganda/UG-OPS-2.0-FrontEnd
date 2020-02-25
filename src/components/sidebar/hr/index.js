import React from 'react';
import PropTypes from 'prop-types';

import { MdPerson } from 'react-icons/md';
import { FaPlaneDeparture, FaFileContract, FaLaptopCode } from 'react-icons/fa';

import SubItem from '../subItem';

export default function HR() {
  return (
    <div>
      <p className="sidebTopNav">
        <FaPlaneDeparture /> Leave
      </p>
      <div className='showContent'>

        <SubItem
          link="/hr/Plan4Leave"
          textToSet="Plan Leave"
        />

        <SubItem
          link="/hr/Apply4Leave"
          textToSet="Apply For Leave"
        />
      </div>

      <p className="sidebTopNav">
        <FaFileContract /> Contract
      </p>
      <div className='showContent'></div>

      <p className="sidebTopNav">
        <FaLaptopCode /> Work Permit
      </p>
      <div className='showContent'></div>

      <p className="sidebTopNav">
        <MdPerson /> HR Specific
      </p>
      <div className='showContent'>
        <SubItem
          link="/hr/ManagePublicHolidays"
          textToSet="Public Holidays"
        />
      </div>
    </div>
  );
}

HR.propTypes = {
  toggle: PropTypes.bool,
  onClick: PropTypes.func
};
