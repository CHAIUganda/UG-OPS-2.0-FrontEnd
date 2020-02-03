import React from 'react';
import chai from '../../../assets/img/chai.svg';

import './welcome.css';

export default function Welcome() {
  return (
    <div className="setContentInline contentbgColor welcome">
      <h1>You are welcome, to</h1>
      <h2>UG OPS 2.0</h2>
      <img src={chai} alt="logo" height="400" className="welcomeLogo" />
    </div>
  );
}
