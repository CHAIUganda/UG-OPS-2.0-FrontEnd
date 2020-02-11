import React from 'react';
import { IconContext } from 'react-icons';
import { FaAngleDoubleRight } from 'react-icons/fa';
import PropTypes from 'prop-types';

import './leaveNavbar.css';

export default function LeaveNavbar({ changer }) {
  return (
    <div className="row leaveNavContainer">
      <span className="col left">
        Leave Management{' '}
        <IconContext.Provider
          value={{
            color: 'darkblue',
            size: '2em',
            className: 'global-class-name'
          }}
        >
          <FaAngleDoubleRight />
        </IconContext.Provider>
      </span>
      <span className="col navItems" onClick={() => changer('Plan4Leave')}>
        Plan For Leave
      </span>
      <span className="col navItems" onClick={() => changer('Apply4Leave')}>
        Apply For Leave
      </span>
    </div>
  );
}

LeaveNavbar.propTypes = {
  changer: PropTypes.func
};
