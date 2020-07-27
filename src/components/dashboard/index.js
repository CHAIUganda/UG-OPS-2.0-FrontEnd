import React from 'react';

import Header from '../header';
import Sidebar from '../sidebar';
import Content from '../content';
import './dashboard.css';

function Dashboard() {
  return (
    <div className="dashboardContainer">
      <Header />
      <Sidebar />
      <Content />
    </div>
  );
}

export default Dashboard;
