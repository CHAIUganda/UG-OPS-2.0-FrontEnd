import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import { FaPlaneDeparture } from 'react-icons/fa';
import PropTypes from 'prop-types';

import './subItem.css';

export default function SubItem(props) {
  const { link, textToSet } = props;
  const [color, setColor] = useState('white');

  const handleHover = (hover) => {
    if (hover) {
      setColor('#003366');
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
