import React from 'react';
import { Link } from 'react-router-dom';

import chai from '../../../assets/img/chai.svg';
import './headerLeft.css';

export default function HeaderLeft() {
  return (
    <Link to="/">
      <div className="headerLeft row ml-1">
        <img src={chai} alt="logo" height="50" />
        <p className="pt-2 hoverStyle">CHAI UG-OPS 2.0</p>
      </div>
    </Link>
  );
}
