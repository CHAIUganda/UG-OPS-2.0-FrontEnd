import React from 'react';
import { Link } from 'react-router-dom';

import chai from '../../../assets/img/chai.png';
import './headerLeft.css';

export default function HeaderLeft() {
  return (
    <Link to="/">
      <div className="inlineHeader headerLeft">
        <img src={chai} alt="logo" height="50" className="inlineLogo" />
        <p className="inlineLogo">CHAI UG-OPS 2.0</p>
      </div>
    </Link>
  );
}
