import React from 'react';
import PropTypes from 'prop-types';

import ContractRenewal from './contractRenewal';
import WorkPermitRenewal from './workPermitRenewal';
import Plan4Leave from './leaveManagement/planForLeave';
import Apply4Leave from './leaveManagement/applyForLeave';
import ManagePublicHolidays from './HRSpecific/publicHolidays';
import Register from '../auth/register';
import ManageProgrammes from './HRSpecific/programmes';
import SuperviseLeave from './leaveManagement/superviseLeave';
import HRHome from './hrHome';
import ConsolidatedTracker from './HRSpecific/consolidatedTracker';
import ProgramLeaveTracker from './leaveManagement/programTracker';
import ViewAllUsers from '../auth/ViewAllUsers';
import EditUser from '../auth/editUser';

export default function HR(props) {
  const { componentToRender } = props.match.params;
  let user;
  let propsPassed;

  if (props && props.location && props.location.state && props.location.state.propsPassed) {
    // debugger;
    user = props.location.state.user;
    propsPassed = props.location.state.propsPassed;
  }

  const ComponentsObject = {
    ContractRenewal,
    WorkPermitRenewal,
    Plan4Leave,
    Apply4Leave,
    ManagePublicHolidays,
    Register,
    ManageProgrammes,
    SuperviseLeave,
    HRHome,
    ConsolidatedTracker,
    ProgramLeaveTracker,
    ViewAllUsers,
    EditUser
  };

  const Tag = ComponentsObject[componentToRender];
  if (Tag) {
    if (propsPassed && user) {
      return (
        <div className="setContentInline contentbgColor welcome">
          <Tag
            propsPassed={propsPassed}
            user={user}
          />
        </div>
      );
    }
    return (
      <div className="setContentInline contentbgColor welcome">
        <Tag />
      </div>
    );
  }
  return (
    <div className="setContentInline contentbgColor welcome">
      Component not found
    </div>
  );
}

HR.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object
};
