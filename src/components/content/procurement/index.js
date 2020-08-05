import React from 'react';
import PropTypes from 'prop-types';

import CreateProcurement from './createProcurement';
import ManagePrograms from './handlePrograms';
import ManageAccountCodes from './handleAccountCodes';
import CreateProgramComp from './handlePrograms/createProgram';

export default function Procurement(props) {
  const { componentToRender } = props.match.params;
  let user;
  let propsPassed;

  if (props && props.location && props.location.state && props.location.state.propsPassed) {
    user = props.location.state.user;
    propsPassed = props.location.state.propsPassed;
  }

  const ComponentsObject = {
    CreateProcurement,
    ManagePrograms,
    ManageAccountCodes,
    CreateProgramComp
  };

  const Tag = ComponentsObject[componentToRender];

  if (Tag && propsPassed) {
    return (
      <div className="setContentInline contentbgColor welcome">
        <Tag
          propsPassed={propsPassed}
          user={user}
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
