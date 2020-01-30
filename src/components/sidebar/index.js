import React, { useState } from 'react';

import HR from './hr';
import Procurement from './procurement';
import Finance from './finance';
import './sidebar.css';

export default function Sidebar() {
  const [hrToggle, setHrToggle] = useState(false);
  const [procurementToggle, setProcurementToggle] = useState(false);
  const [financeToggle, setFinanceToggle] = useState(false);

  const handleHrToggle = (event) => {
    event.preventDefault();
    setHrToggle(!hrToggle);
    setProcurementToggle(false);
    setFinanceToggle(false);
  };

  const handleProcurementToggle = (event) => {
    event.preventDefault();
    setProcurementToggle(!procurementToggle);
    setHrToggle(false);
    setFinanceToggle(false);
  };

  const handleFinanceToggle = (event) => {
    event.preventDefault();
    setFinanceToggle(!financeToggle);
    setProcurementToggle(false);
    setHrToggle(false);
  };

  return (
    <div className="setSideBarInline sidebgColor fixeSidebar">
      <div className="navContainer">
        <HR toggle={hrToggle} onClick={handleHrToggle} />
      </div>
      <div className="navContainer">
        <Procurement
          toggle={procurementToggle}
          onClick={handleProcurementToggle}
        />
      </div>
      <div className="navContainer">
        <Finance toggle={financeToggle} onClick={handleFinanceToggle} />
      </div>
    </div>
  );
}
