import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import { FaPlaneDeparture } from 'react-icons/fa';
import PropTypes from 'prop-types';

import Icon from '../icon';
import './subItem.css';

export default function SubItem(props) {
  const { link, IcontoSet, textToSet } = props;
  const [color, setColor] = useState('white');

  const handleHover = (hover) => {
    if (hover) {
      setColor('darkblue');
    } else {
      setColor('white');
    }
  };

  return (
    <span
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <Link to={link}>
        <p
          className={`${
            color === 'white' ? 'whiteText' : 'blueText'
          } generalStyles`}
        >
          <Icon icon={() => <IcontoSet />} color={color} />
          <span>{textToSet}</span>
        </p>
      </Link>
    </span>
  );
}

SubItem.propTypes = {
  link: PropTypes.string.isRequired,
  IcontoSet: PropTypes.any.isRequired,
  textToSet: PropTypes.string.isRequired
};
