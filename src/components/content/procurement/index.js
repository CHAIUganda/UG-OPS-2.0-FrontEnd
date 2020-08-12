import React from 'react';
import PropTypes from 'prop-types';

import CreateProcurement from './createProcurement';
import ManagePrograms from './handlePrograms';
import ManageAccountCodes from './handleAccountCodes';
import CreateProgramComp from './handlePrograms/createProgram';
import SingleProgram from './handlePrograms/selectedProgram';

export default function Procurement(props) {
  const { componentToRender } = props.match.params;
  let user;
  let propsPassed;
  let propx;

  if (props && props.location && props.location.state && props.location.state.propsPassed) {
    user = props.location.state.user;
    propsPassed = props.location.state.propsPassed;
  }

  /* Passing props through react routers LINK */
  if (props && props.location && props.location.propsPassed && props.location.propx) {
    propx = props.location.propx;
    propsPassed = props.location.propsPassed;
  }

  const ComponentsObject = {
    CreateProcurement,
    ManagePrograms,
    ManageAccountCodes,
    CreateProgramComp,
    SingleProgram
  };

  const Tag = ComponentsObject[componentToRender];

  if (Tag && propsPassed) {
    return (
      <div className="setContentInline contentbgColor welcome">
        <Tag
          propsPassed={propsPassed}
          user={user}
          propx={propx}
        />
      </div>
    );
  }

  if (Tag && !propsPassed) {
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

Procurement.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object
};
