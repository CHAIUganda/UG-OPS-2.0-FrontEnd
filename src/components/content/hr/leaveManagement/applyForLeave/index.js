import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useOktaAuth } from '@okta/okta-react';

import * as sideBarActions from '../../../../../redux/actions/sideBarActions';
import * as notificationActions from '../../../../../redux/actions/notificationsActions';
import * as authActions from '../../../../../redux/actions/authActions';

import CommonSpinner from '../../../../common/spinner';
import { BASE_URL, returnStatusClass } from '../../../../../config';
import Apply4LeaveModal from './applyForLeaveModal';
import ManageLeaveModal from './manageLeaveModal';
import './apply4Leave.css';

const matchDispatchToProps = {
  changeSection: sideBarActions.changeSection,
  changeActive: sideBarActions.changeActive,
  removeNotification: notificationActions.removeNotification,
  logUserIn: authActions.logUserIn,
  setInitialNotifications: notificationActions.setInitialNotifications
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
  changeActive,
  removeNotification,
  setInitialNotifications,
  logUserIn
}) {
  const [spinner, setSpinner] = useState(false);
  const [leaveDetails, setLeaveDetails] = useState(null);
  const [error, setError] = useState('');
  const [personsLeaves, setPersonsLeaves] = useState([]);

  const { authState, authService } = useOktaAuth();

  changeSection('Human Resource');
  changeActive('Apply4Leave');

  const getPersonsLeaves = () => {
    const turnOffNotifications = (leavesToNotify) => {
      const handleSingleNotification = (n) => {
        axios.defaults.headers.common = { token };
        const endPoint = `${BASE_URL}auth/handleNotifications`;
        const notificationToDismiss = {
          staffEmail: email,
          notificationId: n._id
        };

        axios.post(endPoint, notificationToDismiss)
          .then(() => {
            removeNotification(n._id);
          })
          .catch((err) => {
            if (err.response.status === 401) {
              authService.logout('/');
            }

            if (err && err.response && err.response.data && err.response.data.message) {
              setError(err.response.data.message);
            } else {
              setError(err.message);
            }
          });
      };

      leavesToNotify.forEach((l) => {
        l.notificationDetails.forEach((n) => {
          handleSingleNotification(n);
        });
      });
    };

    const addHighlightProperty = (leaves) => {
      const newArray = [];

      const recursivelyHandleaves = (i) => {
        if (i > leaves.length - 1) {
          return newArray;
        }

        if (leaves[i].notificationDetails) {
          const hasUnread = leaves[i].notificationDetails.some((n) => n.status === 'unRead');
          if (hasUnread) {
            /* Hit end point */
            newArray.push({
              ...leaves[i],
              highlightNotification: true
            });
            recursivelyHandleaves(i + 1);
          } else {
            newArray.push({
              ...leaves[i],
              highlightNotification: false
            });
            recursivelyHandleaves(i + 1);
          }
        } else {
          newArray.push({
            ...leaves[i],
            highlightNotification: false
          });
          recursivelyHandleaves(i + 1);
        }

        return newArray;
      };

      return recursivelyHandleaves(0);
    };

    const endPoint = `${BASE_URL}leaveApi/getStaffLeaves/${email}/all`;
    axios.defaults.headers.common = { token };
    axios.get(endPoint)
      .then((res) => {
        const leavesToSet = addHighlightProperty(res.data.filter((l) => l.status !== 'Planned'));
        const x = leavesToSet.filter((l) => l.highlightNotification === true);
        const y = leavesToSet.filter((l) => l.highlightNotification === false);
        setPersonsLeaves([...y, ...x]);
        turnOffNotifications(x);
        setSpinner(false);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          authService.logout('/');
        }

        if (err && err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      });
  };

  const setUpUser = (tokenToSet) => {
    axios.defaults.headers.common = { token: tokenToSet };
    const apiRoute = `${BASE_URL}auth/getLoggedInUser`;
    axios.get(apiRoute)
      . then((res) => {
        const {
          department,
          fName,
          internationalStaff,
          lName,
          position,
          _id,
          supervisorDetails,
          notifications
        } = res.data;
        const genderToSet = res.data.gender;
        const emailToSet = res.data.email;
        const leaveDetailsToSet = res.data.leaveDetails;

        const userObject = {
          ...res.data,
          email: emailToSet,
          token: tokenToSet,
          gender: genderToSet,
          internationalStaff,
          department,
          firstName: fName,
          lastName: lName,
          Position: position,
          id: _id,
          leaveDetails: leaveDetailsToSet,
          supervisor: supervisorDetails
        };
        setInitialNotifications(notifications);
        logUserIn(userObject);
        setSpinner(false);
      })
      .catch((err) => {
        setSpinner(false);

        if (err.response.status === 401) {
          authService.logout('/');
        }

        if (err && err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      });
  };

  const setUpThisPage = () => {
    const endPoint = `${BASE_URL}leaveApi/getStaffLeavesTaken/${email}`;
    axios.get(endPoint)
      .then((res) => {
        setLeaveDetails(res.data.leaveDetails);
        getPersonsLeaves();
      })
      .catch((err) => {
        setSpinner(false);

        if (err.response.status === 401) {
          authService.logout('/');
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
      setUpThisPage();
    }

    if (!token && authState.isAuthenticated) {
      const { accessToken } = authState;
      setUpUser(`Bearer ${accessToken}`);
    }

    if (!token && !authState.isAuthenticated) {
      setSpinner(false);
      authService.logout('/');
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
          You haven&apos;t applied for leave yet.
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
              <tr
                key={leave._id}
                className={`${leave.highlightNotification ? 'highlightNotification' : ''}`}
              >
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
  };

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
  changeActive: PropTypes.func,
  removeNotification: PropTypes.func,
  setInitialNotifications: PropTypes.func,
  logUserIn: PropTypes.func,
};

export default connect(mapStateToProps, matchDispatchToProps)(Apply4Leave);
