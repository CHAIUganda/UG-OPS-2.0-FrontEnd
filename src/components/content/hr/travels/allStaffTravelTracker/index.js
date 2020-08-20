import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useOktaAuth } from '@okta/okta-react';
import axios from 'axios';

import CommonSpinner from '../../../../common/spinner';

import { BASE_URL } from '../../../../../config';
import * as sideBarActions from '../../../../../redux/actions/sideBarActions';
import * as authActions from '../../../../../redux/actions/authActions';
import * as notificationActions from '../../../../../redux/actions/notificationsActions';


const mapStateToProps = (state) => ({
  token: state.auth.token,
  roles: state.auth.roles,
  email: state.auth.email,
  firstName: state.auth.firstName,
  lastName: state.auth.lastName
});

const mapDispatchToProps = {
  changeSection: sideBarActions.changeSection,
  changeActive: sideBarActions.changeActive,
  logUserIn: authActions.logUserIn,
  setInitialNotifications: notificationActions.setInitialNotifications
};

export const AllStaffTravelTracker = ({
  token,
  changeSection,
  changeActive,
  setInitialNotifications,
  logUserIn,
}) => {
  const [spinner, setSpinner] = useState(false);
  const [loadingPageErr, setLoadingPageErr] = useState('');
  const [allTravels, setAllTravels] = useState([]);

  const { authState, authService } = useOktaAuth();

  changeSection('Human Resource');
  changeActive('allTravelTracker');

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

        if (err && err.response && err.response.status && err.response.status === 401) {
          authService.logout('/');
        }

        if (err && err.response && err.response.data && err.response.data.message) {
          setLoadingPageErr(err.response.data.message);
        } else {
          setLoadingPageErr(err.message);
        }
      });
  };

  const setUpThisPage = () => {
    // set this page up. Do stuff like pick all users.

    const endPoint = `${BASE_URL}hrApi/getAllStaffTravels`;
    axios.defaults.headers.common = { token };
    axios.get(endPoint)
      .then((res) => {
        setAllTravels(res.data);
        setSpinner(false);
      })
      .catch((err) => {
        setSpinner(false);

        if (err && err.response && err.response.status && err.response.status === 401) {
          authService.logout('/');
        }

        if (err && err.response && err.response.data && err.response.data.message) {
          setLoadingPageErr(err.response.data.message);
        } else {
          setLoadingPageErr(err.message);
        }
      });
  };

  useEffect(() => {
    setSpinner(true);
    setLoadingPageErr('');

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

  if (loadingPageErr) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        <p>{loadingPageErr}</p>
      </div>
    );
  }

  if (spinner) {
    return (
      <div className="alert alert-info text-center" role="alert">
        <div>
          <CommonSpinner />
          <p>Getting things ready.....</p>
        </div>
      </div>
    );
  }

  const returnTable = () => {
    if (allTravels.length < 1) {
      return (
        <div className="alert alert-info m-5" role="alert">
          No registered travel history yet.
        </div>
      );
    }

    return (
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Travel Location</th>
            <th>Type Of Trip</th>
            <th>Travel Date</th>
            <th>Return Date</th>
          </tr>
        </thead>
        <tbody>
          {
            allTravels.reverse().map((t) => (
              <tr key={t._id}>
                <td>{t.employeeName}</td>
                <td>{t.travelLocation}</td>
                <td>{t.typeOTrip}</td>
                <td>{new Date(t.dates.travelDate).toDateString()}</td>
                <td>{new Date(t.dates.returnDate).toDateString()}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h2 className="text-center">All Staff Travel Tracker</h2>
      {returnTable()}
    </div>
  );
};

AllStaffTravelTracker.propTypes = {
  token: PropTypes.string,
  changeSection: PropTypes.func,
  changeActive: PropTypes.func,
  setInitialNotifications: PropTypes.func,
  logUserIn: PropTypes.func,
  email: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(AllStaffTravelTracker);
