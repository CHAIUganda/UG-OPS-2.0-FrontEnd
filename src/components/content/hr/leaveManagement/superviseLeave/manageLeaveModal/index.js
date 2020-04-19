import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import { IoMdSettings } from 'react-icons/io';
import { IconContext } from 'react-icons';
import PropTypes from 'prop-types';
import axios from 'axios';

import CommonSpinner from '../../../../../common/spinner';
import { BASE_URL, returnStatusClass } from '../../../../../../config';

export default function ManageLeaveModal({
  leave,
  staff,
  token,
  removeLeaveFromList
}) {
  const [modal, setModal] = useState(false);
  const [error, setError] = useState('');
  const [successFeedback, setSuccessFeedback] = useState('');
  const [reason, setReason] = useState('');
  const [approveSpinner, setApproveSpinner] = useState(false);
  const [declineSpinner, setDeclineSpinner] = useState(false);
  const [manageLeavePaneClass, setManageLeavePaneClass] = useState(true);
  const [leaveStatus, setLeaveStatus] = useState(leave.status);
  const [id2Remove, setId2Remove] = useState(false);

  const toggle = () => {
    const bool = !modal;
    if (!bool && id2Remove) {
      removeLeaveFromList(id2Remove);
      setModal(bool);
      return;
    }
    setModal(bool);
  };

  const handleManageLeave = (event, status) => {
    event.preventDefault();
    setSuccessFeedback('');
    setError('');

    if (status === 'Approved') {
      setApproveSpinner(true);
    } else if (!(reason.length > 0)) {
      setError('Please decline the leave with a reason.');
      return;
    } else {
      setDeclineSpinner(true);
    }

    const manageLeaveObject = {
      leaveId: leave._id,
      status,
      staffEmail: leave.staff.email,
      reason
    };

    axios.defaults.headers.common = { token };
    const endPoint = `${BASE_URL}leaveApi/supervisorHandleLeave`;
    axios.post(endPoint, manageLeaveObject)
      .then((res) => {
        setManageLeavePaneClass(false);
        if (status === 'Approved') {
          setApproveSpinner(false);
        } else {
          setDeclineSpinner(false);
        }
        setId2Remove(leave._id);
        setLeaveStatus(status);
        setSuccessFeedback(res.data.message);
      })
      .catch((err) => {
        if (status === 'Approved') {
          setApproveSpinner(false);
        } else {
          setDeclineSpinner(false);
        }

        if (err && err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      });
  };

  const returnApprovalDeclinePane = () => {
    if (manageLeavePaneClass) {
      return (
        <>
          <hr />
          <div className="row approveDelcineRow">
            <div className="col-4">
              <button className="approved" onClick={(e) => handleManageLeave(e, 'Approved')}>
                {
                  approveSpinner
                    ? <CommonSpinner
                      variant='light'
                    />
                    : 'Approve Leave'
                }
              </button>
            </div>
            <div className="col-8 text-center">
              <h5>Decline Leave</h5>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Decline with a reason</InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Optional"
                  type="text"
                  value={reason}
                  onChange={(e) => {
                    setSuccessFeedback('');
                    setError('');
                    setReason(e.target.value);
                  }}
                />
              </InputGroup>
              <button className="rejected spaceRejectButton" onClick={(e) => handleManageLeave(e, 'Declined')}>
                {
                  declineSpinner
                    ? <CommonSpinner />
                    : 'Decline Leave'
                }
              </button>
            </div>
          </div>
        </>
      );
    }
    return (
      <div> </div>
    );
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
        <ModalHeader toggle={toggle}>
          <h5>Manage Leave</h5>
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col">
              { error
                && <div className="errorFeedback"> {error} </div>
              }
              { successFeedback
                && <div className="successFeedback"> {successFeedback} </div>
              }
            </div>
            <hr />
          </div>
          <div className="row">
            <div className="col">
              <p> To Start: {new Date(leave.startDate).toDateString()}</p>
              <p>Category: {leave.type} </p>
              <p>Comment: {leave.comment} </p>
            </div>
            <div className="col">
              <p>To End: {new Date(leave.endDate).toDateString()} </p>
              <p>Status: <button className={returnStatusClass(leaveStatus)}>
                {leaveStatus}
              </button> </p>
            </div>

            <div className="col">
              <p>Days To Take: {leave.daysTaken} </p>
              <p>Staff: {staff}</p>
            </div>
          </div>
          { returnApprovalDeclinePane() }
          <ModalFooter>
            <Button color="secondary" onClick={toggle} className="float-right">Close</Button>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}


ManageLeaveModal.propTypes = {
  leave: PropTypes.object,
  staff: PropTypes.string,
  token: PropTypes.string,
  removeLeaveFromList: PropTypes.func
};
