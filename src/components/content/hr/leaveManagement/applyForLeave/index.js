import React from 'react';
// prettier-ignore
// import {
//   Spinner
// } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// import { BASE_URL } from '../../../../../config';
import Plan4LeaveModal from './applyForLeaveModal';
import './apply4Leave.css';

const mapStateToProps = (state) => ({
  supervisor: state.auth.supervisor,
  gender: state.auth.gender
});

function Apply4Leave({ supervisor, gender }) {
  return (
    <>
      <h3 className="inlineItem">Your Leaves</h3>
      <Plan4LeaveModal
        supervisor={supervisor}
        gender={gender}
      />
    </>
  );
}

Apply4Leave.propTypes = {
  supervisor: PropTypes.string,
  gender: PropTypes.string
};

export default connect(mapStateToProps)(Apply4Leave);
