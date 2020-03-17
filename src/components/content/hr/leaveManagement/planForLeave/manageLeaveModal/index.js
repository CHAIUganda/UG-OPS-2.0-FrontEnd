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
import axios from 'axios';

import { BASE_URL, returnStatusClass } from '../../../../../../config';
import CommonSpinner from '../../../../../common/spinner';

export default function ManageLeaveModal({ leave, supervisor, removeLeave }) {
  const [modal, setModal] = useState(false);
  const [applySpinner, setApplySpinner] = useState(false);
  const [showApplyButton, setShowApplyButton] = useState(true);
  const [error, setError] = useState('');
  const [successFeedback, setSuccessFeedback] = useState('');
  const [RebuildArray, setRebuildArray] = useState(false);
  const [leaveStatus, setLeaveStatus] = useState(leave.status);

  const toggle = () => {
    const bool = !modal;
    if (!bool && RebuildArray) {
      removeLeave(leave._id);
      setModal(bool);
      return;
    }
    setModal(bool);
  };

  const handleApply4Leave = (event) => {
    event.preventDefault();
    setApplySpinner(true);
    setError('');
    setSuccessFeedback('');
    /* Apply for the leave */
    const leaveObject = {
      ...leave,
      status: 'Pending Supervisor',
      staffEmail: leave.staff.email
    };

    const endPoint = `${BASE_URL}leaveApi/leave`;
    axios.post(endPoint, leaveObject)
      .then((res) => {
        setApplySpinner(false);
        setShowApplyButton(false);
        setRebuildArray(true);
        setLeaveStatus('Pending Supervisor');
        setSuccessFeedback(res.data.message);
      })
      .catch((err) => {
        setApplySpinner(false);
        if (err && err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      });
  };

  const applyForLeaveTxt = () => {
    if (applySpinner) {
      return (
        <div>
          <p>Please wait ... </p>
          <CommonSpinner />
        </div>
      );
    }

    return 'Apply For This Leave';
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
        <ModalHeader toggle={toggle}>Manage Leave</ModalHeader>
        <ModalBody>
          {
            error
            && <div className="errorFeedback row">
              <div className="col">
                {error}
              </div>
            </div>
          }
          {
            successFeedback
            && <div className="successFeedback row">
              <div className="col">
                {successFeedback}
              </div>
            </div>
          }
          <div className="row">
            <div className="col">
              <p> Starts: {new Date(leave.startDate).toDateString()}</p>
              <p>Category: {leave.type} </p>
              <p>Comment: {leave.comment} </p>
            </div>
            <div className="col">
              <p>Ends: {new Date(leave.endDate).toDateString()} </p>
              <p>Status: <button className={returnStatusClass(leaveStatus)}>
                {leaveStatus}
              </button> </p>
            </div>

            <div className="col">
              <p>days Taken: {leave.daysTaken} </p>
              <p>Supervisor: {`${supervisor.fName} ${supervisor.lName}`} </p>
            </div>
          </div>

          <ModalFooter>
            <button className="submitButton">Modify this Leave</button>
            {
              showApplyButton
              && <button className="submitButton" onClick={handleApply4Leave}>{applyForLeaveTxt()}</button>
            }
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
  removeLeave: PropTypes.func
};
