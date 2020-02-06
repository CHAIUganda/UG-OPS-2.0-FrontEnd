import React from 'react';
import PropTypes from 'prop-types';

import SignIn from './signin';

export default function Auth(props) {
  const { componentToRender } = props.match.params;

  const ComponentsObject = {
    SignIn
  };

  const Tag = ComponentsObject[componentToRender];
  return (
    <div className="setContentInline contentbgColor welcome">
      <Tag />
    </div>
  );
}

Auth.propTypes = {
  match: PropTypes.object.isRequired
};
