import React from 'react';
// import { Link } from 'react-router-dom';
import { IoIosPeople } from 'react-icons/io';
import { GiTakeMyMoney } from 'react-icons/gi';
import { FaFileInvoiceDollar } from 'react-icons/fa';

import SubItem from './subItem';
import './headerMiddle.css';

export default function HeaderMiddle() {
  return (
    <div className="middleHeader">
      <SubItem
        link="/"
        IcontoSet={IoIosPeople}
        textToSet="Human Resource"
      />
      <SubItem
        link="/"
        IcontoSet={GiTakeMyMoney}
        textToSet="Procurement"
      />

      <SubItem
        link="/"
        IcontoSet={FaFileInvoiceDollar}
        textToSet="Finance"
      />
    </div>
  );
}
