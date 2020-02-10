import React from 'react';
import PropTypes from 'prop-types';

import SignIn from './signin';
import Register from './register';

export default function Auth(props) {
  let componentToRender;
  const ComponentsObject = {
    SignIn,
    Register
  };

  if (props.match.params.componentToRender) {
    componentToRender = props.match.params.componentToRender;
  } else {
    componentToRender = 'SignIn';
  }

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
