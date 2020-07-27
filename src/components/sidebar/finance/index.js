import React from 'react';
import PropTypes from 'prop-types';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import Icon from '../icon';

import Arrow from '../arrow';
import './finance.css';

export default function Finance(props) {
  const { toggle, onClick } = props;

  return (
    <div>
      <p onClick={onClick} className="sidebTopNav">
        <Icon icon={() => <FaFileInvoiceDollar />} />
        Finance
        <Arrow toggle={toggle} />
      </p>
      <div
        className={`sidebarDropdownContent ${
          toggle ? 'showContent' : 'dntShowContent'
        }`}
      ></div>
    </div>
  );
}

Finance.propTypes = {
  toggle: PropTypes.bool,
  onClick: PropTypes.func
};
