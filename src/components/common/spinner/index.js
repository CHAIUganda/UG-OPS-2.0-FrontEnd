import React from 'react';
import { Spinner } from 'reactstrap';
import PropTypes from 'prop-types';

export default function CommonSpinner({ variant }) {
  return (
    <Spinner color={ variant || 'primary' } style={{ width: '3rem', height: '3rem' }} />
  );
}

CommonSpinner.propTypes = {
  variant: PropTypes.string,
};
