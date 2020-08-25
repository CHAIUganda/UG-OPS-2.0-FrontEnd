import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import Cookies from 'js-cookie';

import * as sideBarActions from '../../../../../redux/actions/sideBarActions';
import * as authActions from '../../../../../redux/actions/authActions';

import ManageLeaveModal from './manageLeaveModal';
import CommonSpinner from '../../../../common/spinner';
import { BASE_URL, returnStatusClass } from '../../../../../config';
import Plan4LeaveModal from './planForLeaveModal';
import './planForLeave.css';

const matchDispatchToProps = {
  changeSection: sideBarActions.changeSection,
  changeActive: sideBarActions.changeActive,
  logUserOut: authActions.logUserOut
};

const mapStateToProps = (state) => ({
  supervisor: state.auth.supervisor,
  gender: state.auth.gender,
  email: state.auth.email,
  token: state.auth.token,
  type: state.auth.type
});

function Plan4Leave({
  supervisor,
  gender,
  email,
  token,
  type,
  changeSection,
  changeActive,
  logUserOut
}) {
  const [spinner, setSpinner] = useState(false);
  const [leaveDetails, setLeaveDetails] = useState(null);
  const [error, setError] = useState('');
  const [personsLeaves, setPersonsLeaves] = useState([]);

  changeSection('Human Resource');
  changeActive('Plan4Leave');

  const getPersonsLeaves = () => {
    const endPoint = `${BASE_URL}leaveApi/getStaffLeaves/${email}/Planned`;
    axios.defaults.headers.common = { token };
    axios.get(endPoint)
      .then((res) => {
        setSpinner(false);
        setPersonsLeaves(res.data);
      })
      .catch((err) => {
        setSpinner(false);

        if (err && err.response && err.response.status && err.response.status === 401) {
          Cookies.remove('token');
          logUserOut();
        }

        if (err && err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      });
  };

  const setUpthisPage = () => {
    axios.defaults.headers.common = { token };
    const endPoint = `${BASE_URL}leaveApi/getStaffLeavesTaken/${email}`;
    axios.get(endPoint)
      .then((res) => {
        setLeaveDetails(res.data.leaveDetails);
        getPersonsLeaves();
      })
      .catch((err) => {
        setSpinner(false);

        if (err && err.response && err.response.status && err.response.status === 401) {
          Cookies.remove('token');
          logUserOut();
        }

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

    if (token) {
      setUpthisPage();
    } else {
      Cookies.remove('token');
      logUserOut();
    }
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

  const returnTable = () => {
    if (personsLeaves.length < 1) {
      return (
        <div className="alert alert-primary m-5" role="alert">
          You haven&apos;t planned for leave yet.
        </div>
      );
    }
    return (
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
                    logUserOut={logUserOut}
                  />
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  };

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
        logUserOut={logUserOut}
      />
      { returnTable() }
    </>
  );
}

Plan4Leave.propTypes = {
  supervisor: PropTypes.string,
  gender: PropTypes.string,
  email: PropTypes.string,
  token: PropTypes.string,
  type: PropTypes.string,
  changeSection: PropTypes.func,
  changeActive: PropTypes.func,
  setInitialNotifications: PropTypes.func,
  logUserIn: PropTypes.func,
  logUserOut: PropTypes.func
};

export default connect(mapStateToProps, matchDispatchToProps)(Plan4Leave);
