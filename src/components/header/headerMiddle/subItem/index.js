import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import { FaPlaneDeparture } from 'react-icons/fa';
import PropTypes from 'prop-types';

import Icon from '../icon';
import './subItem.css';

export default function SubItem(props) {
  const { link, IcontoSet, textToSet } = props;
  const [color, setColor] = useState('blueText');

  const handleHover = (hover) => {
    if (hover) {
      setColor('white');
    } else {
      setColor('#003366');
    }
  };

  return (
    <span
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <Link to={link}>
        <span
          className={`pr-2 pb-2 ${
            color === 'white' ? 'whiteText' : 'blueText'
          } generalStyles`}
        >
          <Icon icon={() => <IcontoSet />} color={color} />
          <span>{textToSet}</span>
        </span>
      </Link>
    </span>
  );
}

SubItem.propTypes = {
  link: PropTypes.string.isRequired,
  IcontoSet: PropTypes.any.isRequired,
  textToSet: PropTypes.string.isRequired
};
