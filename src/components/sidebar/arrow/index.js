import React from 'react';
import { IconContext } from 'react-icons';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import PropTypes from 'prop-types';

import './arrow.css';

export default function Arrow(props) {
  const { toggle } = props;
  return (
    <span className="sidebarArrow">
      <IconContext.Provider
        value={{
          color: 'white',
          size: '2em',
          className: 'global-class-name'
        }}
      >
        <span className="userIcon">
          {toggle ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </span>
      </IconContext.Provider>
    </span>
  );
}

Arrow.propTypes = {
  toggle: PropTypes.bool.isRequired
};
