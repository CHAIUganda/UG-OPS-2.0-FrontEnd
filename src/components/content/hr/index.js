import React from 'react';
import PropTypes from 'prop-types';

import LeaveApplication from './leaveApplication';
import ContractRenewal from './contractRenewal';
import WorkPermitRenewal from './workPermitRenewal';

export default function HR(props) {
  const { componentToRender } = props.match.params;

  const ComponentsObject = {
    LeaveApplication,
    ContractRenewal,
    WorkPermitRenewal
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
