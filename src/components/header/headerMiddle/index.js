import React from 'react';
import { Link } from 'react-router-dom';

import './headerMiddle.css';

export default function HeaderMiddle() {
  return (
    <div className="middleHeader">
      <Link to="/">
        <span className="item ml-3 px-3 pb-2">HOME</span>
      </Link>
      <span className="item ml-3 px-3 pb-2">UPDATES</span>
    </div>
  );
}
