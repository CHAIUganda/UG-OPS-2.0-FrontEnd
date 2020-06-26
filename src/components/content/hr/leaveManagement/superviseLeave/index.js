import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import ManageLeaveModal from './manageLeaveModal';

import * as sideBarActions from '../../../../../redux/actions/sideBarActions';
import CommonSpinner from '../../../../common/spinner';
import { BASE_URL } from '../../../../../config';
import './superviseLeave.css';

const matchDispatchToProps = {
  changeSection: sideBarActions.changeSection,
  changeActive: sideBarActions.changeActive
};

const mapStateToProps = (state) => ({
  gender: state.auth.gender,
  email: state.auth.email,
  token: state.auth.token,
  roles: state.auth.roles
});

function SuperviseLeave({
  email,
  token,
  roles,
  changeSection,
  changeActive
}) {
  const [spinner, setSpinner] = useState(false);
  const [leavesToApprove, setLeavesToApprove] = useState(null);
  const [error, setError] = useState('');

  if (roles) {
    if (!roles.supervisor) {
      return (
        <div className="alert alert-danger text-center" role="alert">
          <p>{'FE: You have no access rights for this resource.'}</p>
        </div>
      );
    }
  } else {
    return (
      <div className="alert alert-danger text-center" role="alert">
        <p>{'FE: You seem to have no roles.'}</p>
        <p>Please contact the system admin to rectify this.</p>
      </div>
    );
  }

  changeSection('Human Resource');
  changeActive('SuperviseLeave');

  useEffect(() => {
    setSpinner(true);
    setError('');
    axios.defaults.headers.common = { token };
    const endPoint = `${BASE_URL}leaveApi/getSupervisorLeaves/${email}/Pending`;
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

  const removeLeaveFromList = (id2Remove) => {
    const newArray = leavesToApprove.filter((leave) => leave._id !== id2Remove);
    setLeavesToApprove([...newArray]);
  };

  const returnTable = () => {
    if (leavesToApprove.length < 1) {
      return (
        <div className="alert alert-primary m-5" role="alert">
          You currently have no leave to supervise.
        </div>
      );
    }
    return (
      <table className="table holidaysTable">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Staff</th>
            <th scope="col">Type</th>
            <th scope="col">No. Of Days</th>
            <th scope="col">Starts</th>
            <th scope="col">Ends</th>
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
                <td>{new Date(leave.startDate).toDateString()}</td>
                <td>{new Date(leave.endDate).toDateString()}</td>
                <td>
                  <ManageLeaveModal
                    leave={leave}
                    staff={`${leave.staff.fName} ${leave.staff.lName}`}
                    token={token}
                    removeLeaveFromList={removeLeaveFromList}
                  />
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  };

  return (
    <>
      <h3 className="inlineItem">Leaves To Supervise</h3>
      { returnTable() }
    </>
  );
}

SuperviseLeave.propTypes = {
  gender: PropTypes.string,
  email: PropTypes.string,
  token: PropTypes.string,
  roles: PropTypes.object,
  changeSection: PropTypes.func,
  changeActive: PropTypes.func
};

export default connect(mapStateToProps, matchDispatchToProps)(SuperviseLeave);
