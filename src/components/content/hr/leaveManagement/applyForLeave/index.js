import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

import * as sideBarActions from '../../../../../redux/actions/sideBarActions';
import CommonSpinner from '../../../../common/spinner';
import { BASE_URL, returnStatusClass } from '../../../../../config';
import Apply4LeaveModal from './applyForLeaveModal';
import ManageLeaveModal from './manageLeaveModal';
import './apply4Leave.css';

const matchDispatchToProps = {
  changeSection: sideBarActions.changeSection,
  changeActive: sideBarActions.changeActive
};

const mapStateToProps = (state) => ({
  supervisor: state.auth.supervisor,
  gender: state.auth.gender,
  email: state.auth.email,
  token: state.auth.token,
  type: state.auth.type
});

function Apply4Leave({
  supervisor,
  gender,
  email,
  token,
  type,
  changeSection,
  changeActive
}) {
  const [spinner, setSpinner] = useState(false);
  const [leaveDetails, setLeaveDetails] = useState(null);
  const [error, setError] = useState('');
  const [personsLeaves, setPersonsLeaves] = useState([]);

  changeSection('Human Resource');
  changeActive('Apply4Leave');

  const getPersonsLeaves = () => {
    const endPoint = `${BASE_URL}leaveApi/getStaffLeaves/${email}/all`;
    axios.defaults.headers.common = { token };
    axios.get(endPoint)
      .then((res) => {
        setSpinner(false);
        setPersonsLeaves(res.data.filter((l) => l.status !== 'Planned'));
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

  const removeLeave = (id) => {
    const newLeaves = personsLeaves.filter((l) => l._id !== id);
    setPersonsLeaves(newLeaves);
  };

  const modifyLeave = (index, leaveObj) => {
    const arrToEdit = [...personsLeaves];
    arrToEdit[index] = leaveObj;
    setPersonsLeaves(arrToEdit.reverse());
  };

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
          personsLeaves.reverse().map((leave, index) => (
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
                  removeLeave={removeLeave}
                  type={type}
                  gender={gender}
                  indexOfLeave={index}
                  propToModifyArray={modifyLeave}
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
      <h3 className="inlineItem">Your Leaves</h3>
      <Apply4LeaveModal
        supervisor={supervisor}
        gender={gender}
        leaveDetails={leaveDetails}
        email={email}
        addLeave={addLeave}
      />
      { returnTable() }
    </>
  );
}

Apply4Leave.propTypes = {
  supervisor: PropTypes.object,
  gender: PropTypes.string,
  email: PropTypes.string,
  token: PropTypes.string,
  type: PropTypes.string,
  changeSection: PropTypes.func,
  changeActive: PropTypes.func
};

export default connect(mapStateToProps, matchDispatchToProps)(Apply4Leave);
