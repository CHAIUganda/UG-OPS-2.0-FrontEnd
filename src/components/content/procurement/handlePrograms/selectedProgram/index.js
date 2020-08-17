import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useOktaAuth } from '@okta/okta-react';
import axios from 'axios';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { IconContext } from 'react-icons';

import CommonSpinner from '../../../../common/spinner';
import EditGeneralDetails from './editGeneralDetails';
import EditPidModal from './EditPidModal';
import EditGidModal from './EditGidModal';
import EditObjectiveCodeModal from './EditObjectiveCodeModal';

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

export const SelectedProgram = ({
  token,
  roles,
  changeSection,
  changeActive,
  setInitialNotifications,
  logUserIn,
  propx
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

  if (!propx) {
    return (
      <div className="alert alert-info" role="alert">
        Please take a step back and select a program.
      </div>
    );
  }

  const [spinner, setSpinner] = useState(false);
  const [loadingPageErr, setLoadingPageErr] = useState('');
  const [allPids, setAllPids] = useState([]);
  const [allGids, setAllGids] = useState([]);
  const [allObjectiveCodes, setAllObjectiveCodes] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showPids, setShowPids] = useState(false);
  const [showGids, setShowGids] = useState(false);
  const [showObjectiveCodes, setShowObjectiveCodes] = useState(false);

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
    const pickObjectiveCodes = () => {
      const endPoint = `${BASE_URL}financeApi/getObjectives/${propx._id}/all`;
      axios.defaults.headers.common = { token };
      axios.get(endPoint)
        .then((res) => {
          setAllObjectiveCodes(res.data);
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

    const pickGIDs = () => {
      const endPoint = `${BASE_URL}financeApi/getGrants/${propx._id}/all`;
      axios.defaults.headers.common = { token };
      axios.get(endPoint)
        .then((res) => {
          setAllGids(res.data);
          // setSpinner(false);
          pickObjectiveCodes();
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

    const pickPIDs = () => {
      const endPoint = `${BASE_URL}financeApi/getProjects/${propx._id}/all`;
      axios.defaults.headers.common = { token };
      axios.get(endPoint)
        .then((res) => {
          setAllPids(res.data);
          // setSpinner(false);
          pickGIDs();
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

    const pickAllUsers = () => {
      axios.defaults.headers.common = { token };
      const endPoint = `${BASE_URL}auth/getUsers`;
      axios.get(endPoint)
        .then((res) => {
          const arrayToSet = res.data.map((user) => ({
            label: `${user.fName} ${user.lName}`,
            value: user._id
          }));
          setAllUsers(arrayToSet);
          pickPIDs();
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

    pickAllUsers();
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

  const editPid = (objTofix, indexOfObj) => {
    const arr = [...allPids];
    arr.splice(indexOfObj, 1, objTofix);
    setAllPids(arr);
  };

  const insertNewPid = (pidToInsert) => {
    const arr = [...allPids];
    arr.push(pidToInsert);
    setAllPids(arr);
  };

  const TableOfPids = () => {
    if (showPids) {
      return (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>PID</th>
              <th>Status</th>
              <th colSpan="2">Edit</th>
              <th>
                <span className="pointerCursor" onClick={
                  (event) => {
                    event.preventDefault();
                    setShowPids(false);
                  }
                }>
                  <IconContext.Provider value={{ size: '3em' }}>
                    <FiMinus />
                  </IconContext.Provider>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {
              allPids.map((p, index) => (
                <tr key={index}>
                  <td>{p.pId}</td>
                  <td>
                    <span
                      className={`${p.status.toLowerCase() === 'active' ? 'bg-success' : 'bg-warning'} p-1`}
                    >{p.status}</span>
                  </td>
                  <td>
                    <span>
                      <EditPidModal
                        pidToEdit={p}
                        editPid={editPid}
                        token={token}
                        BASE_URL={BASE_URL}
                        index={index}
                        newPid={false}
                      />
                    </span></td>
                  <td></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      );
    }

    return (
      <table className="table table-striped">
        <tbody>
          <tr>
            <td>PIDs</td>
            <td>{allPids.length}</td>
            <td>
              <span className="pointerCursor" onClick={
                (event) => {
                  event.preventDefault();
                  setShowPids(true);
                  setShowGids(false);
                  setShowObjectiveCodes(false);
                }
              }>
                <IconContext.Provider value={{ size: '2em' }}>
                  <FiPlus />
                </IconContext.Provider>
              </span>
            </td>
            <td>
              <EditPidModal
                token={token}
                BASE_URL={BASE_URL}
                newPid={true}
                programId={propx._id}
                insertNewPid={insertNewPid}
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const editGid = (objTofix, indexOfObj) => {
    const arr = [...allGids];
    arr.splice(indexOfObj, 1, objTofix);
    setAllGids(arr);
  };

  const insertNewGid = (gidToInsert) => {
    const arr = [...allGids];
    arr.push(gidToInsert);
    setAllGids(arr);
  };

  const TableOfGids = () => {
    if (showGids) {
      return (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>GID</th>
              <th>Status</th>
              <th colSpan="2">Edit</th>
              <th>
                <span className="pointerCursor" onClick={
                  (event) => {
                    event.preventDefault();
                    setShowGids(false);
                  }
                }>
                  <IconContext.Provider value={{ size: '3em' }}>
                    <FiMinus />
                  </IconContext.Provider>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {
              allGids.map((g, index) => (
                <tr key={index}>
                  <td>{g.gId}</td>
                  <td>
                    <span
                      className={`${g.status.toLowerCase() === 'active' ? 'bg-success' : 'bg-warning'} p-1`}
                    >{g.status}</span>
                  </td>
                  <td>
                    <span>
                      <EditGidModal
                        gidToEdit={g}
                        editGid={editGid}
                        token={token}
                        BASE_URL={BASE_URL}
                        index={index}
                        newGid={false}
                      />
                    </span></td>
                  <td></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      );
    }

    return (
      <table className="table table-striped">
        <tbody>
          <tr>
            <td>GIDs</td>
            <td>{allGids.length}</td>
            <td>
              <span className="pointerCursor" onClick={
                (event) => {
                  event.preventDefault();
                  setShowGids(true);
                  setShowPids(false);
                  setShowObjectiveCodes(false);
                }
              }>
                <IconContext.Provider value={{ size: '2em' }}>
                  <FiPlus />
                </IconContext.Provider>
              </span>
            </td>
            <td>
              <EditGidModal
                token={token}
                BASE_URL={BASE_URL}
                newGid={true}
                programId={propx._id}
                insertNewGid={insertNewGid}
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const editObjectiveCode = (objTofix, indexOfObj) => {
    const arr = [...allObjectiveCodes];
    arr.splice(indexOfObj, 1, objTofix);
    setAllGids(arr);
  };

  const insertNewObjectiveCode = (objectiveCodeToInsert) => {
    const arr = [...allObjectiveCodes];
    arr.push(objectiveCodeToInsert);
    setAllObjectiveCodes(arr);
  };

  const TableOfObjectiveCodes = () => {
    if (showObjectiveCodes) {
      return (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Objective Code</th>
              <th>Status</th>
              <th colSpan="2">Edit</th>
              <th>
                <span className="pointerCursor" onClick={
                  (event) => {
                    event.preventDefault();
                    setShowObjectiveCodes(false);
                  }
                }>
                  <IconContext.Provider value={{ size: '3em' }}>
                    <FiMinus />
                  </IconContext.Provider>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {
              allObjectiveCodes.map((o, index) => (
                <tr key={o._id}>
                  <td>{o.objectiveCode}</td>
                  <td>
                    <span
                      className={`${o.status.toLowerCase() === 'active' ? 'bg-success' : 'bg-warning'} p-1`}
                    >{o.status}</span>
                  </td>
                  <td>
                    <span>
                      <EditObjectiveCodeModal
                        objectiveCodeToEdit={o}
                        editObjectiveCode={editObjectiveCode}
                        token={token}
                        BASE_URL={BASE_URL}
                        index={index}
                        newObjectiveCode={false}
                      />
                    </span></td>
                  <td></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      );
    }

    return (
      <table className="table table-striped">
        <tbody>
          <tr>
            <td>Objective Codes</td>
            <td>{allObjectiveCodes.length}</td>
            <td>
              <span className="pointerCursor" onClick={
                (event) => {
                  event.preventDefault();
                  setShowGids(false);
                  setShowPids(false);
                  setShowObjectiveCodes(true);
                }
              }>
                <IconContext.Provider value={{ size: '2em' }}>
                  <FiPlus />
                </IconContext.Provider>
              </span>
            </td>
            <td>
              <EditObjectiveCodeModal
                token={token}
                insertNewObjectiveCode={insertNewObjectiveCode}
                newObjectiveCode={true}
                programId={propx._id}
                BASE_URL={BASE_URL}
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="row">
      <div className="col-12">
        <h1 className="text-center mb-5">{`${propx.name}`}</h1>
        <EditGeneralDetails
          progName={propx.name}
          sForm={propx.shortForm}
          allUsers={allUsers}
          id={propx._id}
          token={token}
          pm={
            allUsers.find((u) => u.value === propx.programManagerDetails._id)
          }
          opsLead={
            allUsers.find((u) => u.value === propx.operationsLeadDetails._id)
          }
        />
        {/* start row */}
        <div className="row">
          <div className="col-12">
            <table className="table table-striped mt-5">
              <tbody>
                <tr>
                  <td>Short Form</td>
                  <td>{propx.shortForm}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Program Manager</td>
                  <td>{`${propx.programManagerDetails.fName}  ${propx.programManagerDetails.lName}`}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Operations Lead</td>
                  <td>{`${propx.operationsLeadDetails.fName}  ${propx.operationsLeadDetails.lName}`}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>

            {/* table of pids */}
            {TableOfPids()}
            {/* table of gids */}
            {TableOfGids()}
            {/* table of objective codes */}
            {TableOfObjectiveCodes()}
          </div>
        </div>
        {/* end row */}
      </div>
    </div>
  );
};

SelectedProgram.propTypes = {
  token: PropTypes.string,
  roles: PropTypes.object,
  changeSection: PropTypes.func,
  changeActive: PropTypes.func,
  setInitialNotifications: PropTypes.func,
  logUserIn: PropTypes.func,
  propx: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectedProgram);
