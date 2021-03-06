import React, { useState, useEffect } from 'react';
import { Spinner } from 'reactstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useOktaAuth } from '@okta/okta-react';

import * as sideBarActions from '../../../../../redux/actions/sideBarActions';
import * as authActions from '../../../../../redux/actions/authActions';
import * as notificationActions from '../../../../../redux/actions/notificationsActions';

import { BASE_URL } from '../../../../../config';
import CreateNewPublicHoliday from './createPublicHolidayModal';
import './publicHolidays.css';

const matchDispatchToProps = {
  changeSection: sideBarActions.changeSection,
  changeActive: sideBarActions.changeActive,
  logUserIn: authActions.logUserIn,
  setInitialNotifications: notificationActions.setInitialNotifications
};

const mapStateToProps = (state) => ({
  roles: state.auth.roles,
  token: state.auth.token
});

function ManagePublicHolidays({
  roles,
  changeSection,
  changeActive,
  token,
  logUserIn,
  setInitialNotifications
}) {
  const { hr, admin } = roles;
  const [publicHolidays, setPublicHolidays] = useState([]);
  const [tableSpinner, setTableSpinner] = useState(false);
  const [tableError, setTableError] = useState('');

  const { authState, authService } = useOktaAuth();

  changeSection('Human Resource');
  changeActive('ManagePublicHolidays');

  const handleDeleteHoliday = (event, id) => {
    event.preventDefault();
    // eslint-disable-next-line no-param-reassign
    event.currentTarget.className = 'disappear';
    const endPoint = `${BASE_URL}hrApi/removePublicHoliday`;
    const holiday = { id };

    axios.post(endPoint, holiday)
      .then(() => {
        const newHolidays = publicHolidays.filter((hol) => hol._id !== id);
        setPublicHolidays(newHolidays);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          authService.logout('/');
        }
        if (err && err.response && err.response.data && err.response.data.message) {
          setTableError(err.response.data.message);
        } else {
          setTableError(err.message);
        }
      });
  };


  const returnTable = () => {
    if (tableError) {
      return <div className="errorFeedback">{ tableError }</div>;
    }

    if (tableSpinner) {
      return <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />;
    }

    return (
      <table className="table holidaysTable">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Holiday</th>
            <th scope="col">Date</th>
            {(hr || admin)
              && <th scope="col">Manage</th>
            }
          </tr>
        </thead>
        <tbody>
          {
            publicHolidays.map((holiday, index) => (
              <tr key={holiday._id}>
                <th scope="row">{index + 1}</th>
                <td>{holiday.name}</td>
                <td>{new Date(`${new Date().getFullYear()}-${holiday.date.split('/')[1]}-${holiday.date.split('/')[0]}`).toDateString()}</td>
                {(hr || admin)
              && <td>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={(event) => handleDeleteHoliday(event, holiday._id)}>
                    Delete
                </button>
              </td>
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  };

  const updatePHolidayArray = (newHoliday) => {
    setPublicHolidays([...publicHolidays, newHoliday]);
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
        setTableSpinner(false);
      })
      .catch((err) => {
        setTableSpinner(false);

        if (err.response.status === 401) {
          authService.logout('/');
        }

        if (err && err.response && err.response.data && err.response.data.message) {
          setTableError(err.response.data.message);
        } else {
          setTableError(err.message);
        }
      });
  };

  const setUpThisPage = () => {
    axios.defaults.headers.common = { token };
    const endPoint = `${BASE_URL}hrApi/getPublicHolidays`;
    axios.get(endPoint)
      .then((res) => {
        setTableSpinner(false);
        setPublicHolidays(res.data);
      })
      .catch((err) => {
        setTableSpinner(false);

        if (err.response.status === 401) {
          authService.logout('/');
        }

        if (err && err.response && err.response.data && err.response.data.message) {
          setTableError(err.response.data.message);
        } else {
          setTableError(err.message);
        }
      });
  };

  useEffect(() => {
    setTableSpinner(true);

    if (token) {
      setUpThisPage();
    }

    if (!token && authState.isAuthenticated) {
      const { accessToken } = authState;
      setUpUser(`Bearer ${accessToken}`);
    }

    if (!token && !authState.isAuthenticated) {
      setTableSpinner(false);
      authService.logout('/');
    }
  }, []);

  return (
    <div>
      <div>
        <h2 className="inlineItem">Public Holidays</h2>
        { (hr || admin)
          && <CreateNewPublicHoliday onNewPHoliday={updatePHolidayArray} />
        }
      </div>
      {returnTable()}
    </div>
  );
}


ManagePublicHolidays.propTypes = {
  roles: PropTypes.object,
  changeSection: PropTypes.func,
  changeActive: PropTypes.func,
  token: PropTypes.string,
  logUserIn: PropTypes.func,
  setInitialNotifications: PropTypes.func,
};

export default connect(mapStateToProps, matchDispatchToProps)(ManagePublicHolidays);
