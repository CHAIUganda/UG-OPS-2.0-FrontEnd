import React from 'react';
import PropTypes from 'prop-types';

import SignIn from './signin';
import Register from './register';
import ResetPassword from './resetPassword';

export default function Auth(props) {
  let componentToRender;
  const props2Pass = {};

  const ComponentsObject = {
    SignIn,
    Register,
    ResetPassword
  };

  if (props.location.pathname.includes('ResetPassword')) {
    componentToRender = 'ResetPassword';
    const path = props.location.pathname.split('/');
    const token = path[path.length - 1];
    const email = path[path.length - 2];
    props2Pass.email = email;
    props2Pass.token = token;
  } else if (props.match.params.componentToRender) {
    componentToRender = props.match.params.componentToRender;
  } else {
    componentToRender = 'SignIn';
  }

  const Tag = ComponentsObject[componentToRender];
  return (
    <div className="setContentInline contentbgColor welcome">
      <Tag props2Pass={props2Pass} />
    </div>
  );
}

Auth.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object
};
