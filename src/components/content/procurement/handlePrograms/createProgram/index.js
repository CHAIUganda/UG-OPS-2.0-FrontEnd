import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useOktaAuth } from '@okta/okta-react';
import axios from 'axios';

import CommonSpinner from '../../../../common/spinner';
import InitialDetailsComp from './initialDetails';
import AddPids from './newPids';
import AddGids from './newGids';
import AddObjectiveCodes from './newObjectiveCodes';
import Finish from './finishComponent/FinishComponent';

import { BASE_URL } from '../../../../../config';
import * as sideBarActions from '../../../../../redux/actions/sideBarActions';
import * as authActions from '../../../../../redux/actions/authActions';
import * as notificationActions from '../../../../../redux/actions/notificationsActions';


const mapStateToProps = (state) => ({
  token: state.auth.token,
  roles: state.auth.roles
});

const mapDispatchToProps = {
  changeSection: sideBarActions.changeSection,
  changeActive: sideBarActions.changeActive,
  logUserIn: authActions.logUserIn,
  setInitialNotifications: notificationActions.setInitialNotifications
};

export const CreateProgram = ({
  token,
  roles,
  changeSection,
  changeActive,
  setInitialNotifications,
  logUserIn,
}) => {
  // Check for roles

  if (token && roles) {
    if (!roles.financeAdmin && !roles.admin) {
      return (
        <div className="alert alert-danger text-center" role="alert">
          <p>{'FE: You have no access rights for this resource.'}</p>
        </div>
      );
    }
  }

  const [spinner, setSpinner] = useState(false);
  const [loadingPageErr, setLoadingPageErr] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [newPids, setNewPids] = useState([]);
  const [newGids, setNewGids] = useState([]);
  const [newObjectiveCodes, setNewObjectiveCodes] = useState([]);

  const [initialProDetails, setInitialProDetails] = useState(
    {
      name: '',
      programManager: '',
      operationsLead: '',
      shortForm: ''
    }
  );
  const [currentComponent, setCurrentComponent] = useState(3);

  const { authState, authService } = useOktaAuth();

  changeSection('Procurement');
  changeActive('CreateProgram');

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
    setSpinner(false);

    axios.defaults.headers.common = { token };
    const endPoint = `${BASE_URL}auth/getUsers`;
    axios.get(endPoint)
      .then((res) => {
        setSpinner(false);
        const arrayToSet = res.data.map((user) => ({
          label: `${user.fName} ${user.lName}`,
          value: user._id
        }));
        setAllUsers(arrayToSet);
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

  const returnComponent = () => {
    if (currentComponent === 0) {
      return (
        <InitialDetailsComp
          allUsers={allUsers}
          initialProDetails={initialProDetails}
          setInitialProDetails={setInitialProDetails}
          setCurrentComponent={setCurrentComponent}
        />
      );
    }

    if (currentComponent === 1) {
      return (
        <AddPids
          newPids={newPids}
          setNewPids={setNewPids}
          setCurrentComponent={setCurrentComponent}
        />
      );
    }

    if (currentComponent === 2) {
      return (
        <AddGids
          newGids={newGids}
          setNewGids={setNewGids}
          setCurrentComponent={setCurrentComponent}
        />
      );
    }

    if (currentComponent === 3) {
      return (
        <AddObjectiveCodes
          newObjectiveCodes={newObjectiveCodes}
          setNewObjectiveCodes={setNewObjectiveCodes}
          setCurrentComponent={setCurrentComponent}
        />
      );
    }

    if (currentComponent === 4) {
      return (
        <Finish
          initialProDetails={initialProDetails}
          newPids={newPids}
          newGids={newGids}
          newObjectiveCodes={newObjectiveCodes}
          setNewPids={setNewPids}
          setNewGids={setNewGids}
          setNewObjectiveCodes={setNewObjectiveCodes}
          setInitialProDetails={setInitialProDetails}
          setCurrentComponent={setCurrentComponent}
        />
      );
    }

    return (
      <InitialDetailsComp
        allUsers={allUsers}
        initialProDetails={initialProDetails}
        setInitialProDetails={setInitialProDetails}
        setCurrentComponent={setCurrentComponent}
      />
    );
  };

  return (
    <div>
      <h2>Create A New Program</h2>
      {returnComponent()}
    </div>
  );
};

CreateProgram.propTypes = {
  token: PropTypes.string,
  roles: PropTypes.object,
  changeSection: PropTypes.func,
  changeActive: PropTypes.func,
  setInitialNotifications: PropTypes.func,
  logUserIn: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateProgram);
