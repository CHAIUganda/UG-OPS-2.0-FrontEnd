import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter
} from 'reactstrap';
import { IoMdSettings } from 'react-icons/io';
import { IconContext } from 'react-icons';
import PropTypes from 'prop-types';

import { returnStatusClass } from '../../../../../../config';

export default function ManageLeaveModal({ leave, supervisor }) {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

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
        <ModalHeader toggle={toggle}>Manage Leave</ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col">
              <p> Starts: {new Date(leave.startDate).toDateString()}</p>
              <p>Category: {leave.type} </p>
              <p>Comment: {leave.comment} </p>
            </div>
            <div className="col">
              <p>Ends: {new Date(leave.endDate).toDateString()} </p>
              <p>Status: <button className={returnStatusClass(leave.status)}>
                {leave.status}
              </button> </p>
            </div>

            <div className="col">
              <p>days Taken: {leave.daysTaken} </p>
              <p>Supervisor: {`${supervisor.fName} ${supervisor.lName}`} </p>
              { leave.rejectionReason
              && <p>Rejection reason: { leave.rejectionReason }  </p>
              }
              <p></p>
            </div>
          </div>

          <ModalFooter>
            <button className="submitButton">Cancel The Leave</button>
            <Button color="secondary" onClick={toggle} className="float-right">Close</Button>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}


ManageLeaveModal.propTypes = {
  leave: PropTypes.object,
  supervisor: PropTypes.object,
};
