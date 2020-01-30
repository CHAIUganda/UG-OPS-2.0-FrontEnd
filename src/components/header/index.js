import React from 'react';

import HeaderLeft from './headerLeft';
import HeaderMiddle from './headerMiddle';
import HeaderRight from './headerRight';
import './header.css';

export default function Header() {
  return (
    <div className="headerDiv">
      <HeaderLeft />
      <HeaderMiddle />
      <HeaderRight />
    </div>
  );
}
