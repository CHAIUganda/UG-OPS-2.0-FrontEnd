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
import Spinner from '../../../../../common/spinner';


const SpecificContractModal = ({ contract }) => {
  const [modal, setModal] = useState(false);
  const [dismissSpinner, setDismissSpiner] = useState(false);
  const [snoozeSpinner, setSnoozeSpinner] = useState(false);

  const toggle = () => setModal(!modal);

  const handleClickDismiss = () => {
    setDismissSpiner(true);
    setDismissSpiner(false);
  };

  const handleClickSnooze = () => {
    setSnoozeSpinner(true);
    setSnoozeSpinner(false);
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
        <ModalHeader toggle={toggle}>Expiring contract</ModalHeader>
        <ModalBody>
          <div className='row'>
            <div className='col'>
              <p>Name: {`  ${contract.fName} ${contract.lName}`}</p>
              <p>Program: {`  ${contract.program}`}</p>
              <p>Position: {`  ${contract.title}`}</p>
              <p>Supervisor: {`  ${contract.supervisorDetails.fName} ${contract.supervisorDetails.lName}`}</p>
              <p>Program Manager: {`${contract.programManagerDetails.fName} ${contract.programManagerDetails.lName}`}</p>
            </div>
            <div className='col'>
              <p>Expires in: {`  ${contract.daysLeftonContract} days`}</p>
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
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

SpecificContractModal.propTypes = {
  contract: PropTypes.object
};

export default SpecificContractModal;
