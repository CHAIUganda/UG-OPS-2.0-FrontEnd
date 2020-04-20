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


const SpecificWorkPermitModal = ({ workPermit }) => {
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
        <ModalHeader toggle={toggle}>Expiring Work Permit</ModalHeader>
        <ModalBody>
          <div className='row'>
            <div className='col'>
              <p>Name: {`  ${workPermit.fName} ${workPermit.lName}`}</p>
              <p>Program: {`  ${workPermit.program}`}</p>
              <p>Position: {`  ${workPermit.title}`}</p>
              <p>Supervisor: {`  ${workPermit.supervisorDetails.fName} ${workPermit.supervisorDetails.lName}`}</p>
              <p>Program Manager: {`${workPermit.programManagerDetails.fName} ${workPermit.programManagerDetails.lName}`}</p>
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
  workPermit: PropTypes.object
};

export default SpecificWorkPermitModal;
