import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { IoMdAdd } from 'react-icons/io';
import { FiEdit } from 'react-icons/fi';
import { IconContext } from 'react-icons';
import PropTypes from 'prop-types';
import { useOktaAuth } from '@okta/okta-react';
import axios from 'axios';
import { Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';

import { BASE_URL } from '../../../../config';

import * as sideBarActions from '../../../../redux/actions/sideBarActions';
import * as authActions from '../../../../redux/actions/authActions';
import * as notificationActions from '../../../../redux/actions/notificationsActions';

import CommonSpinner from '../../../common/spinner';

import './handlePrograms.css';

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

export const HandlePrograms = ({
  changeSection,
  changeActive,
  token,
  setInitialNotifications,
  logUserIn,
  roles
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
  const [allPrograms, setAllPrograms] = useState([]);
  const [tableSpinner, setTableSpinner] = useState(false);
  const [tableError, setTableError] = useState('');

  const { authState, authService } = useOktaAuth();

  changeSection('Procurement');
  changeActive('ManagePrograms');

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
    // set this page up. Do stuff like pick all programs.
    setSpinner(false);
    setTableError('');
    setTableSpinner(true);

    const endPoint = `${BASE_URL}hrApi/getPrograms`;
    axios.defaults.headers.common = { token };
    axios.get(endPoint)
      .then((res) => {
        setAllPrograms(res.data);
        setTableSpinner(false);
      })
      .catch((err) => {
        setTableSpinner(false);

        if (err && err.response && err.response.status && err.response.status === 401) {
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
    if (tableError) {
      return <div className="errorFeedback">{ tableError }</div>;
    }

    if (tableSpinner) {
      return <>
        <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
        <p>Loading Table Contents...</p>
      </>;
    }

    if (allPrograms.length < 1) {
      return (
        <div className="alert alert-info" role="alert">
          No programs so far.
        </div>
      );
    }

    return (
      <table className="table holidaysTable">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Program</th>
            <th scope="col">Shortform</th>
            <th scope="col">Program Manager</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody>
          {
            allPrograms.map((prog, index) => (
              <tr key={prog._id}>
                <td scope="row">{index + 1}</td>
                <td>{prog.name}</td>
                <td>{prog.shortForm}</td>
                <td>{`${prog.programManagerDetails.fName} ${prog.programManagerDetails.lName}`}</td>
                <td>
                  <IconContext.Provider value={{ size: '2em' }}>
                    <FiEdit />
                  </IconContext.Provider>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <div>
        <h2 className="inlineItem">Programs</h2>
        <Link to="/procurement/CreateProgramComp">
          <span className="float-right mr-3 forceColor">
            <IconContext.Provider value={{ size: '1em' }}>
              <IoMdAdd />
            </IconContext.Provider>
          New Program
          </span>
        </Link>
      </div>
      {returnTable()}
    </div>
  );
};

HandlePrograms.propTypes = {
  token: PropTypes.string,
  email: PropTypes.string,
  changeSection: PropTypes.func,
  changeActive: PropTypes.func,
  setInitialNotifications: PropTypes.func,
  logUserIn: PropTypes.func,
  roles: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(HandlePrograms);
