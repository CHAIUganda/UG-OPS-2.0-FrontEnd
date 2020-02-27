import React from 'react';
// prettier-ignore
// import {
//   Spinner
// } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// import { BASE_URL } from '../../../../../config';
import Plan4LeaveModal from './planForLeaveModal';
import './planForLeave.css';

const mapStateToProps = (state) => ({
  supervisor: state.auth.supervisor,
  gender: state.auth.gender
});

function Plan4Leave({ supervisor, gender }) {
  return (
    <>
      <h3 className="inlineItem">Planned Leaves</h3>
      <Plan4LeaveModal
        supervisor={supervisor}
        gender={gender}
        className={'planLeaveModal'}
      />
    </>
  );
}

Plan4Leave.propTypes = {
  supervisor: PropTypes.string,
  gender: PropTypes.string
};

export default connect(mapStateToProps)(Plan4Leave);
