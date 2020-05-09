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
  type,
  gender,
  indexOfLeave,
  propToModifyArray
}) {
  const [modal, setModal] = useState(false);
  const [error, setError] = useState('');
  const [successFeedback, setSuccessFeedback] = useState('');
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


  const toggle = () => {
    const bool = !modal;

    if (!bool && modifyArray) {
      propToModifyArray(indexOfLeave,
        {
          ...leave,
          type: category,
          startDate: leaveDates[0],
          endDate: leaveDates[1],
          comment,
          status: leaveStatus
        });
      setModal(bool);
      return;
    }
    setModal(bool);
  };

  const handleCancelLeave = (event) => {
    event.preventDefault();
    setCancelSpinner(true);
    setError('');
    setSuccessFeedback('');

    const leaveObject = {
      leaveId: leave._id,
      action: 'cancelLeave',
      staffEmail: leave.staff.email,
      type: category,
      startDate: leaveDates[0],
      endDate: leaveDates[1],
      comment,
      status: leave.status
    };

    const endPoint = `${BASE_URL}leaveApi/staffModifyLeave`;
    axios.post(endPoint, leaveObject)
      .then((res) => {
        setCancelSpinner(false);
        setShowCancelButton(false);
        setShowModifyLeaveButton(false);
        setModifyArray(true);
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
      startDate: leaveDates[0],
      endDate: leaveDates[1],
      comment
    };

    const endPoint = `${BASE_URL}leaveApi/staffModifyLeave`;
    axios.post(endPoint, leaveObject)
      .then((res) => {
        setModifyLeaveSpinner(false);
        setModifyArray(true);
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

  const returnModalFooter = () => {
    if (leave.status === 'Cancelled' || leave.status.includes('Declined') || leave.status === 'Not taken') {
      return (
        <>
          <Button color="secondary" onClick={toggle} className="float-right">Close</Button>
        </>
      );
    }

    return (
      <>
        {
          showModifyLeaveButton
          && <button className="submitButton" onClick={handleModifyLeave}>{modifyLeaveTxt()}</button>
        }
        {
          showCancelButton
          && <button className="submitButton" onClick={handleCancelLeave}>{cancelLeaveTxt()}</button>
        }
        <Button color="secondary" onClick={toggle} className="float-right">Close</Button>
      </>
    );
  };

  /*
    convert to lower case and compare with paul's list then return.
  */

  const returnLeaveDetails = () => {
    if (
      leaveStatus.toLowerCase() === 'planned'
      || leaveStatus.toLowerCase() === 'approved'
      || leaveStatus.toLowerCase() === 'taken'
      || leaveStatus.toLowerCase() === 'pending supervisor'
      || leaveStatus.toLowerCase() === 'pending country director'
    ) {
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
                {returnModalFooter()}
              </ModalFooter>
            </ModalBody>
          </Modal>
        </div>
      );
    }

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
            {/* <div className="row">
              <div className="col">
                <p>Status: </span><button className={returnStatusClass(leaveStatus)}>
                  {leaveStatus}
                </button> </p>
              </div>
            </div> */}

            <div className="row">
              <div className="col">
                <p> <span className="blur">To Start:</span> {new Date(leave.startDate).toDateString()}</p>
                <p><span className="blur">Category:</span> {leave.type} </p>
                <p><span className="blur">Comment: </span>{leave.comment} </p>
              </div>
              <div className="col">
                <p><span className="blur">To End: </span> {new Date(leave.endDate).toDateString()} </p>
                <p><span className="blur">Status: </span> <button className={returnStatusClass(leaveStatus)}>
                  {leaveStatus}
                </button> </p>
                { leave.rejectionReason
                  && <p> <span className="blur">Reason for declining your leave:</span>
                    {`   ${leave.rejectionReason}`}
                  </p>
                }
              </div>

              <div className="col">
                <p><span className="blur">Days To Take:</span> {leave.daysTaken} </p>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  };

  return (returnLeaveDetails());
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
