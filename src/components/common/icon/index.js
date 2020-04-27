import React from 'react';
import { IconContext } from 'react-icons';
import PropTypes from 'prop-types';

export default function Icon(props) {
  const { Icon2Render, color, size } = props;
  return (
    <IconContext.Provider
      value={{
        color: color || 'white',
        size: size || '2em',
        className: 'global-class-name'
      }}
    >
      <Icon2Render />
    </IconContext.Provider>
  );
}

Icon.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string,
  Icon2Render: PropTypes.element
};
