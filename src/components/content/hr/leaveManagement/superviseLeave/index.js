import React, { useState, useEffect } from 'react';
// prettier-ignore
// import {
//   Spinner
// } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import ManageLeaveModal from '../applyForLeave/manageLeaveModal';

import CommonSpinner from '../../../../common/spinner';
import { BASE_URL } from '../../../../../config';
import './superviseLeave.css';

const mapStateToProps = (state) => ({
  supervisor: state.auth.supervisor,
  gender: state.auth.gender,
  email: state.auth.email,
  token: state.auth.token
});

function SuperviseLeave({
  supervisor,
  email,
  token
}) {
  const [spinner, setSpinner] = useState(false);
  const [leavesToApprove, setLeavesToApprove] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setSpinner(true);
    setError('');
    axios.defaults.headers.common = { token };
    const endPoint = `${BASE_URL}leaveApi/getSupervisorLeaves/${email}/Pending Supervisor`;
    axios.get(endPoint)
      .then((res) => {
        setLeavesToApprove(res.data);
        setSpinner(false);
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

  if (spinner || !leavesToApprove) {
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
          <th scope="col">#</th>
          <th scope="col">Staff</th>
          <th scope="col">Category</th>
          <th scope="col">Days Taken</th>
          <th scope="col">Manage</th>
        </tr>
      </thead>
      <tbody>
        {
          leavesToApprove.map((leave, index) => (
            <tr key={leave._id}>
              <th scope="row">{index + 1}</th>
              <td>{`${leave.staff.fName} ${leave.staff.lName}`}</td>
              <td>{leave.type}</td>
              <td>{leave.daysTaken}</td>
              <td>
                <ManageLeaveModal
                  type={'plan'}
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

  return (
    <>
      <h3 className="inlineItem">Leaves To Supervise</h3>
      { returnTable() }
    </>
  );
}

SuperviseLeave.propTypes = {
  supervisor: PropTypes.string,
  gender: PropTypes.string,
  email: PropTypes.string,
  token: PropTypes.string
};

export default connect(mapStateToProps)(SuperviseLeave);
