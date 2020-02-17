import React, { useState } from 'react';

import HRSpecificNav from './hrSpecificNav';
import ManagePublicHolidays from './publicHolidays';
import HRhome from './hrHome';

export default function HRSpecific() {
  const [selector, setSelector] = useState('');

  const modules = {
    hrHome: 'hrHome',
    ManagePublicHolidays: 'ManagePublicHolidays'
  };

  const renderHRModule = () => {
    if (selector === modules.hrHome) {
      return <HRhome />;
    }

    if (selector === modules.ManagePublicHolidays) {
      return <ManagePublicHolidays />;
    }
    return <HRhome />;
  };

  const changeModules = (module) => {
    setSelector(module);
  };

  return (
    <>
      <HRSpecificNav changer={changeModules} />
      {renderHRModule()}
    </>
  );
}
