import React from 'react';
import PropTypes from 'prop-types';

import SignIn from './signin';
import Register from './register';
import ResetPassword from './resetPassword';

export default function Auth(props) {
  let componentToRender;

  const ComponentsObject = {
    SignIn,
    Register,
    ResetPassword
  };

  if (props.match.params.componentToRender) {
    componentToRender = props.match.params.componentToRender;
  } else if (props.location.pathname.includes('ResetPassword')) {
    componentToRender = 'ResetPassword';
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
  match: PropTypes.object.isRequired,
  location: PropTypes.object
};
