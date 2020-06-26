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
import { connect } from 'react-redux';

import * as notificationActions from '../../../../../../redux/actions/notificationsActions';
import Spinner from '../../../../../common/spinner';

const matchDispatchToProps = {
  removeNotification: notificationActions.removeNotification
};

const mapStateToProps = (state) => ({
  email: state.auth.email
});

const SpecificContractModal = ({
  BASE_URL,
  contract,
  token,
  modifyContractsList,
  index,
  email,
  removeNotification
}) => {
  const [modal, setModal] = useState(false);
  const [dismissSpinner, setDismissSpiner] = useState(false);
  const [snoozeSpinner, setSnoozeSpinner] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [removeFromList, setRemoveFromList] = useState(false);

  const turnOffNotifications = () => {
    const handleSingleNotification = (c) => {
      axios.defaults.headers.common = { token };
      const endPoint = `${BASE_URL}auth/handleNotifications`;
      const notificationToDismiss = {
        staffEmail: email,
        notificationId: c._id
      };

      axios.post(endPoint, notificationToDismiss)
        .then(() => {
          removeNotification(c._id);
        })
        .catch((err) => {
          if (err && err.response && err.response.data && err.response.data.message) {
            setError(err.response.data.message);
          } else {
            setError(err.message);
          }
        });
    };

    contract.notificationDetails.forEach((c) => {
      handleSingleNotification(c);
    });
  };

  const toggle = () => {
    if (removeFromList) {
      modifyContractsList(index);
    }
    setModal(!modal);
  };

  const handleClickDismiss = () => {
    setError('');
    setSuccessMessage('');
    setDismissSpiner(true);
    const endPoint = `${BASE_URL}hrApi/handleContractNotifications`;
    axios.defaults.headers.common = { token };
    const contractToDismiss = {
      contractId: contract.contractId,
      contractDismiss: true,
      contractSnooze: false
    };

    axios.post(endPoint, contractToDismiss)
      .then((res) => {
        setDismissSpiner(false);
        setSuccessMessage(res.data.message);
        setRemoveFromList(true);
        turnOffNotifications();
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
    setError('');
    setSuccessMessage('');
    setSnoozeSpinner(true);
    const endPoint = `${BASE_URL}hrApi/handleContractNotifications`;
    axios.defaults.headers.common = { token };
    const contractToSnooze = {
      contractId: contract.contractId,
      contractDismiss: false,
      contractSnooze: true
    };

    axios.post(endPoint, contractToSnooze)
      .then((res) => {
        setSnoozeSpinner(false);
        setSuccessMessage(res.data.message);
        setRemoveFromList(true);
        turnOffNotifications();
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
          Expiring contract
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
              <p>Name: {`  ${contract.fName} ${contract.lName}`}</p>
              <p>Program: {`  ${contract.program}`}</p>
              <p>Position: {`  ${contract.title}`}</p>
              <p>Supervisor: {`  ${contract.supervisorDetails.fName} ${contract.supervisorDetails.lName}`}</p>
              <p>Program Manager:
                {
                  (contract && contract.programManagerDetails)
                    ? `${contract.programManagerDetails.fName} ${contract.programManagerDetails.lName}`
                    : '_'
                }</p>
            </div>
            <div className='col'>
              <p>Contract Expires in: {`  ${contract.daysLeftonContract} days`}</p>
              <p>Contract Start Date: {new Date(contract.contractStartDate).toDateString()}</p>
              <p>Contract End Date: {new Date(contract.contractEndDate).toDateString()}</p>
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
          <Button color="secondary" onClick={toggle}>Close</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

SpecificContractModal.propTypes = {
  contract: PropTypes.object,
  token: PropTypes.string,
  BASE_URL: PropTypes.string,
  modifyContractsList: PropTypes.func,
  index: PropTypes.number,
  email: PropTypes.string,
  removeNotification: PropTypes.func
};

export default connect(mapStateToProps, matchDispatchToProps)(SpecificContractModal);
