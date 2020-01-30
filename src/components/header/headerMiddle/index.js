import React from 'react';
import { Link } from 'react-router-dom';

import './headerMiddle.css';

export default function HeaderMiddle() {
  return (
    <div className="inlineHeader middleHeader">
      <Link to="/">
        <span className="item">HOME</span>
      </Link>
      <span className="item">MEDICINE</span>
      <span className="item">UPDATES</span>
    </div>
  );
}
