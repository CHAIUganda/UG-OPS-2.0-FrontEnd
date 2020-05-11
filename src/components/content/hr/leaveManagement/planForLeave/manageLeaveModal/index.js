import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  CustomInput,
} from 'reactstrap';
import { IoMdSettings } from 'react-icons/io';
import { IconContext } from 'react-icons';
import PropTypes from 'prop-types';
import axios from 'axios';
import Calendar from 'react-calendar';

import { BASE_URL, returnStatusClass } from '../../../../../../config';
import CommonSpinner from '../../../../../common/spinner';

export default function ManageLeaveModal({
  leave,
  supervisor,
  removeLeave,
  type,
  gender,
  indexOfLeave,
  propToModifyArray
}) {
  const [modal, setModal] = useState(false);
  const [applySpinner, setApplySpinner] = useState(false);
  const [showApplyButton, setShowApplyButton] = useState(true);
  const [error, setError] = useState('');
  const [successFeedback, setSuccessFeedback] = useState('');
  const [RebuildArray, setRebuildArray] = useState(false);
  const [leaveStatus, setLeaveStatus] = useState(leave.status);
  const [showCancelButton, setShowCancelButton] = useState(true);
  const [showModifyLeaveButton, setShowModifyLeaveButton] = useState(true);
  const [modifyLeaveSpinner, setModifyLeaveSpinner] = useState(false);
  const [cancelSpinner, setCancelSpinner] = useState(false);
  const [supervisorName] = useState(`${supervisor.fName} ${supervisor.lName}`);
  const [category, setCategory] = useState(leave.type);
  const [comment, setComment] = useState('');
  const [leaveDates, setLeaveDate] = useState([new Date(leave.startDate), new Date(leave.endDate)]);
  const [modifyArray, setModifyArray] = useState(false);
  const [leaveObjFromServer, setLeaveObjectFromServer] = useState(false);


  const toggle = () => {
    const bool = !modal;
    if (!bool && RebuildArray) {
      removeLeave(leave._id);
      setModal(bool);
      return;
    }

    if (!bool && modifyArray) {
      if (leaveObjFromServer) {
        propToModifyArray(indexOfLeave, { ...leaveObjFromServer });
      } else {
        propToModifyArray(indexOfLeave,
          {
            ...leave,
            type: category,
            startDate: leaveDates[0],
            endDate: leaveDates[1],
            comment,
            status: leaveStatus
          });
      }
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
      leaveId: leave._id,
      action: 'applyForLeave',
      staffEmail: leave.staff.email
    };

    const endPoint = `${BASE_URL}leaveApi/handlePlannedLeave`;
    axios.post(endPoint, leaveObject)
      .then((res) => {
        setApplySpinner(false);
        setShowApplyButton(false);
        setShowModifyLeaveButton(false);
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

  const handleCancelLeave = (event) => {
    event.preventDefault();
    setCancelSpinner(true);
    setError('');
    setSuccessFeedback('');
    /* Apply for the leave */
    const leaveObject = {
      leaveId: leave._id,
      action: 'cancelLeave',
      staffEmail: leave.staff.email
    };

    const endPoint = `${BASE_URL}leaveApi/handlePlannedLeave`;
    axios.post(endPoint, leaveObject)
      .then((res) => {
        setCancelSpinner(false);
        setShowCancelButton(false);
        setShowApplyButton(false);
        setShowModifyLeaveButton(false);
        setRebuildArray(true);
        setLeaveStatus('Cancelled');
        setSuccessFeedback(res.data.message);
      })
      .catch((err) => {
        setCancelSpinner(false);
        if (err && err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      });
  };

  const handleModifyLeave = (event) => {
    event.preventDefault();
    setModifyLeaveSpinner(true);
    setModifyArray(false);
    setError('');
    setSuccessFeedback('');
    /* Apply for the leave */
    const leaveObject = {
      leaveId: leave._id,
      action: 'changeLeave',
      staffEmail: leave.staff.email,
      type: category,
      startDate: `${leaveDates[0].getFullYear()}-${leaveDates[0].getMonth() + 1}-${leaveDates[0].getDate()}`,
      endDate: `${leaveDates[1].getFullYear()}-${leaveDates[1].getMonth() + 1}-${leaveDates[1].getDate()}`,
      comment
    };

    const endPoint = `${BASE_URL}leaveApi/handlePlannedLeave`;
    axios.post(endPoint, leaveObject)
      .then((res) => {
        setModifyLeaveSpinner(false);
        setModifyArray(true);
        setLeaveObjectFromServer(res.data.leave);
        setSuccessFeedback(res.data.message);
      })
      .catch((err) => {
        setModifyLeaveSpinner(false);
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

  const cancelLeaveTxt = () => {
    if (cancelSpinner) {
      return (
        <div>
          <p>Please wait ... </p>
          <CommonSpinner />
        </div>
      );
    }

    return 'Cancel Leave';
  };

  const modifyLeaveTxt = () => {
    if (modifyLeaveSpinner) {
      return (
        <div>
          <p>Please wait ... </p>
          <CommonSpinner />
        </div>
      );
    }

    return 'Modify Leave';
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
              <p>Status: <button className={returnStatusClass(leaveStatus)}>
                {leaveStatus}
              </button> </p>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Supervisor</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="text"
                    value={supervisorName}
                    disabled
                  />
                </InputGroup>
              </FormGroup>
              {/* Category */}
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Category</InputGroupText>
                  </InputGroupAddon>
                  <CustomInput
                    type="select"
                    id="exampleCustomSelect"
                    name="customSelect"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Annual">Annual Leave</option>
                    {gender === 'Female'
                      && <option value="Maternatiy">Maternity Leave</option>
                    }
                    {(gender === 'Male' || gender === 'male')
                        && <option value="Paternity">Paternity Leave</option>
                    }
                    {
                      (type === 'tcn' || type === 'expat')
                && <option value="Home">Home Leave</option>
                    }
                    <option value="Study">Study Leave</option>
                    <option value="Unpaid">Unpaid Leave</option>
                  </CustomInput>
                </InputGroup>
              </FormGroup>
              {/* Comment */}
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Comment</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Optional"
                    type="text"
                    value={comment}
                    onChange={(e) => {
                      setSuccessFeedback('');
                      setError('');
                      setComment(e.target.value);
                    }}
                  />
                </InputGroup>
              </FormGroup>
              {/*  leave Date */}
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Select Range of Leave</InputGroupText>
                  </InputGroupAddon>
                  <Calendar
                    value={leaveDates}
                    selectRange={true}
                    onChange={(date) => {
                      setSuccessFeedback('');
                      setError('');
                      setError('');
                      setLeaveDate(date);
                    }
                    } />
                </InputGroup>
              </FormGroup>
            </div>
          </div>

          <ModalFooter>
            {
              showModifyLeaveButton
              && <button className="submitButton" onClick={handleModifyLeave}>{modifyLeaveTxt()}</button>
            }
            {
              showApplyButton
              && <button className="submitButton" onClick={handleApply4Leave}>{applyForLeaveTxt()}</button>
            }
            {
              showCancelButton
              && <button className="submitButton" onClick={handleCancelLeave}>{cancelLeaveTxt()}</button>
            }
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
  removeLeave: PropTypes.func,
  type: PropTypes.string,
  gender: PropTypes.string,
  indexOfLeave: PropTypes.number,
  propToModifyArray: PropTypes.func
};
