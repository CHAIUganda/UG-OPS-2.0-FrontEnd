import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Spinner } from 'reactstrap';
import axios from 'axios';
import { useOktaAuth } from '@okta/okta-react';

import * as sideBarActions from '../../../../../redux/actions/sideBarActions';
import * as authActions from '../../../../../redux/actions/authActions';
import * as notificationActions from '../../../../../redux/actions/notificationsActions';

import { BASE_URL } from '../../../../../config';
import CreateNewProgramme from './createProgrammeModal';
import EditProgram from './editProgramModal';
import './programmes.css';

const matchDispatchToProps = {
  changeSection: sideBarActions.changeSection,
  changeActive: sideBarActions.changeActive,
  logUserIn: authActions.logUserIn,
  setInitialNotifications: notificationActions.setInitialNotifications
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
  email: state.auth.email,
  gender: state.auth.gender,
  type: state.auth.type,
  program: state.auth.program,
  roles: state.auth.roles
});

function ManageProgrammes({
  token,
  roles,
  changeSection,
  changeActive,
  setInitialNotifications,
  logUserIn
}) {
  const [programmes, setProgrammes] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [tableSpinner, setTableSpinner] = useState(false);
  const [tableError, setTableError] = useState('');

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
  changeActive('ManagePrograms');

  const handleprogramme = (event, id) => {
    event.preventDefault();
    // eslint-disable-next-line no-param-reassign
    event.currentTarget.className = 'disappear';
    const endPoint = `${BASE_URL}hrApi/deleteProgram`;
    const programme = { id };

    axios.defaults.headers.common = { token };
    axios.post(endPoint, programme)
      .then(() => {
        const newProgrammes = programmes.filter((prog) => prog._id !== id);
        setProgrammes(newProgrammes);
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

  const manageProgs = (progIndex, editObj) => {
    const arrToEdit = [...programmes];
    arrToEdit.splice(progIndex, 1, editObj);
    setProgrammes(arrToEdit);
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
            <th scope="col">Program</th>
            <th scope="col">Shortform</th>
            <th scope="col">Program Manager</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody>
          {
            programmes.map((prog, index) => (
              <tr key={prog._id}>
                <td scope="row">{index + 1}</td>
                <td>{prog.name}</td>
                <td>{prog.shortForm}</td>
                <td>{`${prog.programManagerDetails.fName} ${prog.programManagerDetails.lName}`}</td>
                <td>
                  <EditProgram
                    program={prog}
                    progIndex={index}
                    manageProg={manageProgs}
                    token={token}
                    allUsers={allUsers}
                    setDefault={
                      allUsers.filter((u) => u.value === prog.programManagerId)[0]
                    }
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={(event) => handleprogramme(event, prog._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  };

  const updateProgrammesArray = (newProgram) => {
    setProgrammes([...programmes, newProgram]);
  };

  const getUsers = () => {
    axios.defaults.headers.common = { token };
    const endPoint = `${BASE_URL}auth/getUsers`;

    axios.get(endPoint)
      .then((res) => {
        setTableSpinner(false);
        const arrayToSet = res.data.map((user) => ({
          label: `${user.fName} ${user.lName}`,
          value: user._id
        }));
        setAllUsers(arrayToSet);
      })
      .catch((err) => {
        setTableSpinner(false);
        if (err && err.response && err.response.data && err.response.data.message) {
          setTableError(err.response.data.message);
        } else {
          setTableError(err.message);
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
        setTableSpinner(false);
      })
      .catch((err) => {
        setTableSpinner(false);
        if (err && err.response && err.response.data && err.response.data.message) {
          setTableError(err.response.data.message);
        } else {
          setTableError(err.message);
        }
      });
  };

  const setUpThisPage = () => {
    const endPoint = `${BASE_URL}hrApi/getPrograms`;
    axios.defaults.headers.common = { token };
    axios.get(endPoint)
      .then((res) => {
        setProgrammes(res.data);
        getUsers();
      })
      .catch((err) => {
        setTableSpinner(false);
        if (err && err.response && err.response.data && err.response.data.message) {
          setTableError(err.response.data.message);
        } else {
          setTableError(err.message);
        }
      });
  };

  useEffect(() => {
    setTableSpinner(true);
    setTableError('');

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
        <h2 className="inlineItem">CHAI Programs</h2>
        <CreateNewProgramme
          allUsers={allUsers}
          onNewProgramme={updateProgrammesArray}
        />
      </div>
      {returnTable()}
    </div>
  );
}

ManageProgrammes.propTypes = {
  token: PropTypes.string,
  roles: PropTypes.object,
  changeSection: PropTypes.func,
  changeActive: PropTypes.func,
  setInitialNotifications: PropTypes.func,
  logUserIn: PropTypes.func,
};

export default connect(mapStateToProps, matchDispatchToProps)(ManageProgrammes);
