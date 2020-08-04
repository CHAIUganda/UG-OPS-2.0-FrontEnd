import React, { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useOktaAuth } from '@okta/okta-react';

import * as sideBarActions from '../../../../../redux/actions/sideBarActions';
import * as authActions from '../../../../../redux/actions/authActions';
import * as notificationActions from '../../../../../redux/actions/notificationsActions';

import { BASE_URL } from '../../../../../config';
import SpecificContractModal from './specificWorkPermitModal';

const matchDispatchToProps = {
  changeSection: sideBarActions.changeSection,
  changeActive: sideBarActions.changeActive,
  logUserIn: authActions.logUserIn,
  setInitialNotifications: notificationActions.setInitialNotifications
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
  roles: state.auth.roles
});

function WorkPermitsExpiry({
  token,
  roles,
  changeSection,
  changeActive,
  logUserIn,
  setInitialNotifications
}) {
  const [tableSpinner, setTableSpinner] = useState(false);
  const [workPermits, setWorkPermits] = useState([]);
  const [error, setError] = useState('');

  const { authState, authService } = useOktaAuth();

  if (token && roles) {
    if (!roles.hr && !roles.admin) {
      return (
        <div className="alert alert-danger text-center" role="alert">
          <p>{'FE: You have no access rights for this resource.'}</p>
        </div>
      );
    }
  }

  changeSection('Human Resource');
  changeActive('WorkPermitsExpiry');

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

        if (err && err.response && err.response.status && err.response.status === 401) {
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
    const endPoint = `${BASE_URL}hrApi/getUsersWorkPermits/90`;
    axios.defaults.headers.common = { token };
    axios.get(endPoint)
      .then((res) => {
        setTableSpinner(false);
        setWorkPermits(res.data);
      })
      .catch((err) => {
        setTableSpinner(false);

        if (err && err.response && err.response.status && err.response.status === 401) {
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
    setTableSpinner(true);
    setError('');

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

  if (tableSpinner) {
    return (
      <>
        <h6>Please wait... </h6>
        <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
      </>
    );
  }

  if (error) {
    return <div className="errorFeedback">{ error }</div>;
  }

  const modifyWorkPermitList = (index) => {
    const arr = [...workPermits];
    arr.splice(index, 1);
    setWorkPermits(arr);
  };

  const returnTable = () => (
    <table className="table holidaysTable">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Program</th>
          <th scope="col">Program Manager</th>
          <th scope="col">Time to Expiry</th>
        </tr>
      </thead>
      <tbody>
        {
          workPermits.map((workPermit, index) => (
            <tr key={workPermit._id}>
              <td>{ index + 1 }</td>
              <td>{`${workPermit.fName} ${workPermit.lName}`}</td>
              <td>{workPermit.programShortForm}</td>
              <td>
                {
                  (workPermit && workPermit.programManagerDetails)
                  && `${workPermit.programManagerDetails.fName} ${workPermit.programManagerDetails.lName}`
                }
              </td>
              <td>{`${workPermit.daysLeftonWorkPermit} days`}</td>
              <td>
                <SpecificContractModal
                  workPermit={workPermit}
                  token={token}
                  BASE_URL={BASE_URL}
                  modifyWorkPermitList={modifyWorkPermitList}
                  index={index}
                />
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );
  return (
    <div>
      <h1>Expiring Work Permits</h1>
      {returnTable()}
    </div>
  );
}

WorkPermitsExpiry.propTypes = {
  token: PropTypes.string,
  roles: PropTypes.object,
  changeSection: PropTypes.func,
  changeActive: PropTypes.func,
  logUserIn: PropTypes.func,
  setInitialNotifications: PropTypes.func,
};

export default connect(mapStateToProps, matchDispatchToProps)(WorkPermitsExpiry);
