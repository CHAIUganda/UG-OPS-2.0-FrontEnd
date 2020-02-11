import React, { useState } from 'react';

import LeaveNavbar from './leaveNavbar';
import Apply4Leave from './applyForLeave';
import Plan4Leave from './planForLeave';

export default function LeaveManagement() {
  const [selector, setSelector] = useState('');

  const renderLeaveModule = () => {
    debugger;
    if (selector === 'Apply4Leave') {
      return <Apply4Leave />;
    }
    if (selector === 'Plan4Leave') {
      return <Plan4Leave />;
    }
    return <span></span>;
  };

  const changeModules = (module) => {
    debugger;
    setSelector(module);
  };

  return (
    <>
      <LeaveNavbar changer={changeModules} />
      {renderLeaveModule()}
    </>
  );
}
