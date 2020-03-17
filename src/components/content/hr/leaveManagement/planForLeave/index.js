import React, { useState, useEffect } from 'react';
// prettier-ignore
// import {
//   Spinner
// } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import ManageLeaveModal from './manageLeaveModal';

import CommonSpinner from '../../../../common/spinner';
import { BASE_URL, returnStatusClass } from '../../../../../config';
import Plan4LeaveModal from './planForLeaveModal';
import './planForLeave.css';

const mapStateToProps = (state) => ({
  supervisor: state.auth.supervisor,
  gender: state.auth.gender,
  email: state.auth.email,
  token: state.auth.token
});

function Plan4Leave({
  supervisor,
  gender,
  email,
  token
}) {
  const [spinner, setSpinner] = useState(false);
  const [leaveDetails, setLeaveDetails] = useState(null);
  const [error, setError] = useState('');
  const [personsLeaves, setPersonsLeaves] = useState([]);

  const getPersonsLeaves = () => {
    const endPoint = `${BASE_URL}leaveApi/getStaffLeaves/${email}/Planned`;
    axios.defaults.headers.common = { token };
    axios.get(endPoint)
      .then((res) => {
        setSpinner(false);
        setPersonsLeaves(res.data);
      })
      .catch((err) => {
        if (err && err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      });
  };

  useEffect(() => {
    setSpinner(true);
    setError(false);
    const endPoint = `${BASE_URL}leaveApi/getStaffLeavesTaken/${email}`;
    axios.get(endPoint)
      .then((res) => {
        setLeaveDetails(res.data.leaveDetails);
        setSpinner(false);
        getPersonsLeaves();
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

  const returnTable = () => (
    <table className="table holidaysTable">
      <thead>
        <tr>
          <th scope="col">Category</th>
          <th scope="col">Days Taken</th>
          <th scope="col">Starts</th>
          <th scope="col">Ends</th>
          <th scope="col">Status</th>
          <th scope="col">Manage</th>
        </tr>
      </thead>
      <tbody>
        {
          personsLeaves.reverse().map((leave) => (
            <tr key={leave._id}>
              <td>{leave.type}</td>
              <td>{leave.daysTaken}</td>
              <td>{new Date(leave.startDate).toDateString()}</td>
              <td>{new Date(leave.endDate).toDateString()}</td>
              <td>
                <button className={returnStatusClass(leave.status)}>
                  {leave.status}
                </button>
              </td>
              <td>
                <ManageLeaveModal
                  leave={leave}
                  supervisor={supervisor}
                />
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );

  const addLeave = (leave) => {
    setPersonsLeaves([...personsLeaves, leave]);
  };

  return (
    <>
      <h3 className="inlineItem">Planned Leaves</h3>
      <Plan4LeaveModal
        supervisor={supervisor}
        gender={gender}
        className={'planLeaveModal'}
        leaveDetails={leaveDetails}
        addLeave={addLeave}
      />
      { returnTable() }
    </>
  );
}

Plan4Leave.propTypes = {
  supervisor: PropTypes.string,
  gender: PropTypes.string,
  email: PropTypes.string,
  token: PropTypes.string
};

export default connect(mapStateToProps)(Plan4Leave);
