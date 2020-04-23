import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import { IconContext } from 'react-icons';
import { IoMdSettings } from 'react-icons/io';
import PropTypes from 'prop-types';
import axios from 'axios';

import Spinner from '../../../../../common/spinner';


const SpecificWorkPermitModal = ({
  BASE_URL,
  workPermit,
  token,
  modifyWorkPermitList,
  index
}) => {
  const [modal, setModal] = useState(false);
  const [dismissSpinner, setDismissSpiner] = useState(false);
  const [snoozeSpinner, setSnoozeSpinner] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [removeFromList, setRemoveFromList] = useState(false);

  const toggle = () => {
    if (removeFromList) {
      modifyWorkPermitList(index);
    }
    setModal(!modal);
  };

  const handleClickDismiss = () => {
    setError('');
    setSuccessMessage('');
    setDismissSpiner(true);
    const endPoint = `${BASE_URL}hrApi/handleWPNotifications`;
    axios.defaults.headers.common = { token };
    const workpermitToDismiss = {
      workPermitId: workPermit.workPermitId,
      wpDismiss: true,
      wpSnooze: false
    };

    axios.post(endPoint, workpermitToDismiss)
      .then((res) => {
        setDismissSpiner(false);
        setSuccessMessage(res.data.message);
        setRemoveFromList(true);
      })
      .catch((err) => {
        setDismissSpiner(false);
        if (err && err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      });
  };

  const handleClickSnooze = () => {
    setSnoozeSpinner(true);
    setError('');
    setSuccessMessage('');
    const endPoint = `${BASE_URL}hrApi/handleWPNotifications`;
    axios.defaults.headers.common = { token };
    const workpermitToSnooze = {
      workPermitId: workPermit.workPermitId,
      wpDismiss: false,
      wpSnooze: true
    };

    axios.post(endPoint, workpermitToSnooze)
      .then((res) => {
        setSnoozeSpinner(false);
        setSuccessMessage(res.data.message);
        setRemoveFromList(true);
      })
      .catch((err) => {
        setSnoozeSpinner(false);
        if (err && err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      });
  };

  const returnDismissText = () => {
    if (dismissSpinner) {
      return <Spinner />;
    }

    return 'Dismiss';
  };

  const returnSnoozeText = () => {
    if (snoozeSpinner) {
      return <Spinner />;
    }

    return 'Snooze';
  };

  return (
    <div>
      <span
        onClick={toggle}
        className="pointerCursor">
        <IconContext.Provider value={{ size: '2em' }}>
          <IoMdSettings />
        </IconContext.Provider>
      </span>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader>
          Expiring Work Permit
        </ModalHeader>
        <ModalBody>
          {
            error
                && <div className="alert alert-danger" role="alert">
                  { error }
                </div>
          }
          {
            successMessage
                && <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
          }
          <div className='row'>
            <div className='col'>
              <p>Name: {`  ${workPermit.fName} ${workPermit.lName}`}</p>
              <p>Program: {`  ${workPermit.program}`}</p>
              <p>Position: {`  ${workPermit.title}`}</p>
              <p>Supervisor: {`  ${workPermit.supervisorDetails.fName} ${workPermit.supervisorDetails.lName}`}</p>
              <p>Program Manager:
                {
                  (workPermit && workPermit.programManagerDetails)
                    ? `${workPermit.programManagerDetails.fName} ${workPermit.programManagerDetails.lName}`
                    : '_'
                }
              </p>
            </div>
            <div className='col'>
              <p>Work Permit Expires in: {`  ${workPermit.daysLeftonWorkPermit} days`}</p>
              <p>
                Work Permit Issue Date: {new Date(workPermit.workPermitStartDate).toDateString()}
              </p>
              <p>
                Work Permit Expiry Date: {new Date(workPermit.workPermitEndDate).toDateString()}
              </p>
            </div>
          </div>
          {/* buttons */}
          <hr />
          <div className='row'>
            <div className='col'>
              <button className="submitButton float-left" onClick={handleClickDismiss}>{returnDismissText()}</button>
              <button className="submitButton float-right" onClick={handleClickSnooze}>{returnSnoozeText()}</button>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

SpecificWorkPermitModal.propTypes = {
  workPermit: PropTypes.object,
  token: PropTypes.string,
  BASE_URL: PropTypes.string,
  modifyWorkPermitList: PropTypes.func,
  index: PropTypes.number
};

export default SpecificWorkPermitModal;
