import React, { useState, useEffect } from 'react';
// prettier-ignore
// import {
//   Spinner
// } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

import CommonSpinner from '../../../../common/spinner';
import { BASE_URL } from '../../../../../config';
import Plan4LeaveModal from './planForLeaveModal';
import './planForLeave.css';

const mapStateToProps = (state) => ({
  supervisor: state.auth.supervisor,
  gender: state.auth.gender,
  email: state.auth.email
});

function Plan4Leave({ supervisor, gender, email }) {
  const [spinner, setSpinner] = useState(false);
  const [leaveDetails, setLeaveDetails] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setSpinner(true);
    setError(false);
    const endPoint = `${BASE_URL}leaveApi/getStaffLeavesTaken/${email}`;
    axios.get(endPoint)
      .then((res) => {
        setLeaveDetails(res.data.leaveDetails);
        setSpinner(false);
        // getPersonsLeaves();
      })
      .catch((err) => {
        setSpinner(false);
        if (err && err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      });
  }, []);

  if (error) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  if (spinner || !leaveDetails) {
    return (
      <div className="alert alert-info text-center" role="alert">
        <div>
          <CommonSpinner />
          <p>Getting things ready.....</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h3 className="inlineItem">Planned Leaves</h3>
      <Plan4LeaveModal
        supervisor={supervisor}
        gender={gender}
        className={'planLeaveModal'}
        leaveDetails={leaveDetails}
      />
    </>
  );
}

Plan4Leave.propTypes = {
  supervisor: PropTypes.string,
  gender: PropTypes.string,
  email: PropTypes.string
};

export default connect(mapStateToProps)(Plan4Leave);
