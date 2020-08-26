import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { IoIosArrowBack } from 'react-icons/io';
import Cookies from 'js-cookie';

import { BASE_URL } from '../../../../../../config';
import CommonSpinner from '../../../../../common/spinner';
import Icon from '../../../../../common/icon';

import * as authActions from '../../../../../../redux/actions/authActions';

const mapStateToProps = (state) => ({
  token: state.auth.token,
});

const mapDispatchToProps = {
  logUserOut: authActions.logUserOut
};

export const FinishComponent = ({
  initialProDetails,
  newPids,
  newGids,
  newObjectiveCodes,
  token,
  setNewPids,
  setNewGids,
  setNewObjectiveCodes,
  setInitialProDetails,
  setCurrentComponent,
  logUserOut
}) => {
  const [submitMessage, setSubmitMessage] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const reset = () => {
    setNewPids([]);
    setNewGids([]);
    setNewObjectiveCodes([]);
    setInitialProDetails(
      {
        name: '',
        programManager: '',
        operationsLead: '',
        shortForm: ''
      }
    );
  };

  const createProgram = (event) => {
    event.preventDefault();
    setErrMessage('');
    setSuccessMessage('');

    const createObjCodes = (idOfProgram) => {
      if (newObjectiveCodes.length < 1) {
        setSubmitMessage('');
        reset();
        setSuccessMessage('Program created successfully.');
      } else {
        setSubmitMessage('Creating Objective Codes ...');
        axios.defaults.headers.common = { token };
        const newObjCode = {
          objectiveCode: newObjectiveCodes,
          programId: idOfProgram
        };
        const apiRoute = `${BASE_URL}financeApi/createObjective`;
        axios.post(apiRoute, newObjCode)
          .then(() => {
            setSubmitMessage('');
            reset();
            setSuccessMessage('Program created successfully.');
          })
          .catch((err) => {
            setSubmitMessage('');

            if (err && err.response && err.response.status && err.response.status === 401) {
              Cookies.remove('token');
              logUserOut();
            }

            if (err && err.response && err.response.data && err.response.data.message) {
              setErrMessage(err.response.data.message);
            } else {
              setErrMessage(err.message);
            }
          });
      }
    };

    const createGIDs = (idOfProgram) => {
      if (newGids.length < 1) {
        createObjCodes(idOfProgram);
      } else {
        setSubmitMessage('Creating GIDs ...');
        axios.defaults.headers.common = { token };
        const newGid = {
          gId: newGids,
          programId: idOfProgram
        };
        const apiRoute = `${BASE_URL}financeApi/createGrant`;
        axios.post(apiRoute, newGid)
          .then(() => {
            createObjCodes(idOfProgram);
          })
          .catch((err) => {
            setSubmitMessage('');

            if (err && err.response && err.response.status && err.response.status === 401) {
              Cookies.remove('token');
              logUserOut();
            }

            if (err && err.response && err.response.data && err.response.data.message) {
              setErrMessage(err.response.data.message);
            } else {
              setErrMessage(err.message);
            }
          });
      }
    };

    const createPIDs = (idOfProgram) => {
      if (newPids.length < 1) {
        createGIDs(idOfProgram);
      } else {
        setSubmitMessage('Creating PIDs ...');
        axios.defaults.headers.common = { token };
        const newPid = {
          pId: newPids,
          programId: idOfProgram
        };
        const apiRoute = `${BASE_URL}financeApi/createProject`;
        axios.post(apiRoute, newPid)
          .then(() => {
            createGIDs(idOfProgram);
          })
          .catch((err) => {
            setSubmitMessage('');

            if (err && err.response && err.response.status && err.response.status === 401) {
              Cookies.remove('token');
              logUserOut();
            }

            if (err && err.response && err.response.data && err.response.data.message) {
              setErrMessage(err.response.data.message);
            } else {
              setErrMessage(err.message);
            }
          });
      }
    };

    const createProgramFunc = () => {
      setSubmitMessage('Creating Program ...');
      axios.defaults.headers.common = { token };
      const newProg = {
        name: initialProDetails.name,
        programManagerId: initialProDetails.programManager.value,
        operationsLeadId: initialProDetails.operationsLead.value,
        shortForm: initialProDetails.shortForm
      };

      const apiRoute = `${BASE_URL}hrApi/createProgram`;
      axios.post(apiRoute, newProg)
        .then((res) => {
          createPIDs(res.data._id);
        })
        .catch((err) => {
          setSubmitMessage('');

          if (err && err.response && err.response.status && err.response.status === 401) {
            Cookies.remove('token');
            logUserOut();
          }

          if (err && err.response && err.response.data && err.response.data.message) {
            setErrMessage(err.response.data.message);
          } else {
            setErrMessage(err.message);
          }
        });
    };

    createProgramFunc();
  };

  const returnPIDs = () => {
    if (!newPids) {
      return (
        <p>No Pids to show.</p>
      );
    }

    if (newPids.length < 1) {
      return (
        <p>No PIDs were added.</p>
      );
    }

    return newPids.map((pid, index) => (<p key={index}>{pid}</p>));
  };

  const returnGIDs = () => {
    if (!newGids) {
      return (
        <p>No Gids to show.</p>
      );
    }

    if (newGids.length < 1) {
      return (
        <p>No GIDs were added.</p>
      );
    }

    return newGids.map((gid, index) => (<p key={index}>{gid}</p>));
  };

  const returnObjectiveCodes = () => {
    if (!newObjectiveCodes) {
      return (
        <p>No Objective Codes to show.</p>
      );
    }

    if (newObjectiveCodes.length < 1) {
      return (
        <p>No Objective Codes were added.</p>
      );
    }

    return newObjectiveCodes.map((obj, index) => (<p key={index}>{obj}</p>));
  };

  return (
    <div>
      <h4>Final Program Details</h4>
      <code>
        <h6>General Program Details</h6>
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        {errMessage && (
          <div className="alert alert-danger" role="alert">
            {errMessage}
          </div>
        )}
        <p>Program Name:  {`${initialProDetails.name}`}</p>
        <p>Short Form:  {`${initialProDetails.shortForm}`}</p>
        <p>Program Manager:  {`${initialProDetails.programManager.label}`}</p>
        <p>Operations Lead:  {`${initialProDetails.operationsLead.label}`}</p>
      </code>

      <code>
        <h6>PIDS</h6>
        {returnPIDs()}
      </code>

      <code>
        <h6>GIDS</h6>
        {returnGIDs()}
      </code>

      <code>
        <h6>Objective Codes</h6>
        {returnObjectiveCodes()}
      </code>

      {
        submitMessage
        && (
          <div className="alert alert-info text-center m-4" role="alert">
            <div>
              <CommonSpinner />
              <p>{submitMessage}</p>
            </div>
          </div>
        )
      }

      {successMessage && (
        <div className="alert alert-success mb-5" role="alert">
          {successMessage}
        </div>
      )}

      {errMessage && (
        <div className="alert alert-danger mb-5" role="alert">
          {errMessage}
        </div>
      )}

      { !submitMessage && (<div className="pushChildToBottomPrograms m-5">
        <button className='pointerCursor float-left nextButton'
          onClick={
            (event) => {
              event.preventDefault();
              setCurrentComponent(3);
            }
          }
        >
          <Icon
            Icon2Render={IoIosArrowBack}
            color={'#003366'}
          />
            Back
        </button>

        <button className="submitButton float-right" onClick={createProgram}>Create Program</button>
      </div>)}
    </div>
  );
};

FinishComponent.propTypes = {
  token: PropTypes.string,
  initialProDetails: PropTypes.object,
  newPids: PropTypes.array,
  newGids: PropTypes.array,
  newObjectiveCodes: PropTypes.array,
  setNewPids: PropTypes.func,
  setNewGids: PropTypes.func,
  setNewObjectiveCodes: PropTypes.func,
  setInitialProDetails: PropTypes.func,
  setCurrentComponent: PropTypes.func,
  logUserOut: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(FinishComponent);
