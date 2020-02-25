import React from 'react';
import PropTypes from 'prop-types';

import ContractRenewal from './contractRenewal';
import WorkPermitRenewal from './workPermitRenewal';
import Plan4Leave from './leaveManagement/planForLeave';
import Apply4Leave from './leaveManagement/applyForLeave';
import ManagePublicHolidays from './HRSpecific/publicHolidays';

export default function HR(props) {
  const { componentToRender } = props.match.params;

  const ComponentsObject = {
    ContractRenewal,
    WorkPermitRenewal,
    Plan4Leave,
    Apply4Leave,
    ManagePublicHolidays
  };

  const Tag = ComponentsObject[componentToRender];

  return (
    <div className="setContentInline contentbgColor welcome">
      <Tag />
    </div>
  );
}

HR.propTypes = {
  match: PropTypes.object.isRequired
};
