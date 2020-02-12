import React, { useState } from 'react';

import LeaveNavbar from './leaveNavbar';
import Apply4Leave from './applyForLeave';
import Plan4Leave from './planForLeave';
import LeaveHome from './leaveHome';
import PlannedLeaves from './plannedLeaves';
import LeavesTaken from './leavesTaken';

export default function LeaveManagement() {
  const [selector, setSelector] = useState('');

  const modules = {
    Apply4Leave: 'Apply4Leave',
    Plan4Leave: 'Plan4Leave',
    LeaveHome: 'LeaveHome',
    PlannedLeaves: 'PlannedLeaves',
    LeavesTaken: 'LeavesTaken'
  };

  const renderLeaveModule = () => {
    if (selector === modules.Apply4Leave) {
      return <Apply4Leave />;
    }
    if (selector === modules.Plan4Leave) {
      return <Plan4Leave />;
    }
    if (selector === modules.LeaveHome) {
      return <LeaveHome />;
    }
    if (selector === modules.PlannedLeaves) {
      return <PlannedLeaves />;
    }
    if (selector === modules.LeavesTaken) {
      return <LeavesTaken />;
    }
    return <LeaveHome />;
  };

  const changeModules = (module) => {
    setSelector(module);
  };

  return (
    <>
      <LeaveNavbar changer={changeModules} />
      {renderLeaveModule()}
    </>
  );
}
