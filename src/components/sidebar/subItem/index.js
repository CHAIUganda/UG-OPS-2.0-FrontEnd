import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './subItem.css';

export default function SubItem({ link, textToSet, active }) {
  return (
    <span>
      <Link to={link}>
        <p className={`${active ? 'blueText' : 'whiteText'} generalStyles`}>
          <span>{textToSet}</span>
        </p>
      </Link>
    </span>
  );
}

SubItem.propTypes = {
  link: PropTypes.string.isRequired,
  IcontoSet: PropTypes.any.isRequired,
  textToSet: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired
};
