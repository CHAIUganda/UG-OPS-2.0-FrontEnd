import React from 'react';
import chai from '../../../assets/img/chai.svg';

import './welcome.css';

export default function Welcome() {
  return (
    <div className="setContentInline contentbgColor welcome">
      <div className="row">
        <div className="col-12">
          <div className="imageDiv">
            <img src={chai} alt="logo" className="img-fluid"/>
          </div>
        </div>
      </div>
    </div>
  );
}
