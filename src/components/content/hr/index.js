import React from 'react';
import PropTypes from 'prop-types';

import LeaveManagement from './leaveManagement';
import ContractRenewal from './contractRenewal';
import WorkPermitRenewal from './workPermitRenewal';
import HRSpecific from './HRSpecific';

export default function HR(props) {
  const { componentToRender } = props.match.params;

  const ComponentsObject = {
    LeaveManagement,
    ContractRenewal,
    WorkPermitRenewal,
    HRSpecific
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
