import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';

import CommonSpinner from '../../../../common/spinner';
import NewTravel from './newTravel';

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
  setInitialNotifications: notificationActions.setInitialNotifications,
  logUserOut: authActions.logUserOut
};

export const TravelTracker = ({
  token,
  changeSection,
  changeActive,
  logUserOut,
  email,
  firstName,
  lastName
}) => {
  const [spinner, setSpinner] = useState(false);
  const [loadingPageErr, setLoadingPageErr] = useState('');
  const [myTravels, setMyTravels] = useState([]);

  changeSection('Human Resource');
  changeActive('PersonalTravelTracker');

  const setUpThisPage = () => {
    const endPoint = `${BASE_URL}hrApi/getStaffTravels/${email}`;
    axios.defaults.headers.common = { token };
    axios.get(endPoint)
      .then((res) => {
        setMyTravels(res.data);
        setSpinner(false);
      })
      .catch((err) => {
        setSpinner(false);

        if (err && err.response && err.response.status && err.response.status === 401) {
          Cookies.remove('token');
          logUserOut();
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
    } else {
      Cookies.remove('token');
      logUserOut();
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
    if (myTravels.length < 1) {
      return (
        <div className="alert alert-info m-5" role="alert">
          You have no registered travel history yet
        </div>
      );
    }

    return (
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Travel Location</th>
            <th>Type Of Trip</th>
            <th>Travel Date</th>
            <th>Return Date</th>
          </tr>
        </thead>
        <tbody>
          {
            myTravels.reverse().map((t) => (
              <tr key={t._id}>
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

  const addNewEntry = (newTravelToAdd) => {
    const arr = [...myTravels];
    arr.push(newTravelToAdd);
    setMyTravels(arr);
  };

  return (
    <div>
      <h2 className="inlineItem mr-5">My Travel Tracker</h2>
      <NewTravel
        addNewEntry={addNewEntry}
        token={token}
        name={`${firstName} ${lastName}`}
        email={email}
        BASE_URL={BASE_URL}
        Cookies={Cookies}
        logUserOut={logUserOut}
      />
      {returnTable()}
    </div>
  );
};

TravelTracker.propTypes = {
  token: PropTypes.string,
  changeSection: PropTypes.func,
  changeActive: PropTypes.func,
  setInitialNotifications: PropTypes.func,
  logUserIn: PropTypes.func,
  email: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  logUserOut: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(TravelTracker);
