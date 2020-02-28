import React, { useState, useEffect } from 'react';
import { IoMdAdd } from 'react-icons/io';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Spinner,
  CustomInput,
  Button,
} from 'reactstrap';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';

import axios from 'axios';
import moment from 'moment';

import { BASE_URL } from '../../../../../../config';
import './apply4LeaveModal.css';

export default function Plan4LeaveModal({ supervisor, gender }) {
  const [modal, setModal] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [error] = useState('');
  const [supervisorName] = useState(supervisor);
  const [category, setCategory] = useState('Annual');
  const [comment, setComment] = useState('');
  const [leaveDates, setLeaveDate] = useState();
  const [arrayOfLeaveDays, setArrayOfLeaveDays] = useState([]);
  const [arrayOfWeekends, setArrayOfWeekends] = useState([]);
  const [arrayOfHolidays, setArrayOfHolidays] = useState([]);
  const [holidays, setHolidays] = useState([]);

  const filterLeaveDays = (selectedDays) => {
    const leaveDays = [];
    const weekendDays = [];
    const holidayDays = [];

    let check = true;
    selectedDays.forEach((day) => {
      check = true;
      holidays.forEach((holiday) => {
        let hol = `${new Date().getFullYear()}-${holiday.date.replace('/', '-').split('-')[1]}-${holiday.date.replace('/', '-').split('-')[0]}`;
        let dDay = `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`;
        hol = moment(new Date(hol));
        dDay = moment(new Date(dDay));
        if (check && moment(hol).isSame(dDay)) {
          holidayDays.push({
            day,
            name: holiday.name
          });
          check = false;
        }
      });

      if (check && (day.getDay() === 0 || day.getDay() === 6)) {
        weekendDays.push(day);
        check = false;
      } else if (check) {
        leaveDays.push(day);
      }
    });

    return {
      leaveDays,
      weekendDays,
      holidayDays
    };
  };

  const getLeaveDays = () => {
    const arrayOfDays = [];
    if (leaveDates) {
      arrayOfDays.push(leaveDates[0]);
      let start = leaveDates[0];
      const end = leaveDates[1];
      const firstDate = start.setDate(start.getDate());
      /* wierd but works */
      leaveDates[0] = new Date(firstDate);
      start = new Date(firstDate);
      while (start < end) {
        arrayOfDays.push(start);
        const newDate = start.setDate(start.getDate() + 1);
        start = new Date(newDate);
      }
      arrayOfDays.pop();
      const daysDetails = filterLeaveDays(arrayOfDays);
      setArrayOfLeaveDays(daysDetails.leaveDays);
      setArrayOfWeekends(daysDetails.weekendDays);
      setArrayOfHolidays(daysDetails.holidayDays);
    }
  };

  useEffect(() => {
    getLeaveDays();
  }, [leaveDates]);

  const arrayOfDays2Str = (arr, type) => {
    if (arr.length === 0) {
      return '';
    }

    if (type === 'holiday') {
      return arr.map((arrDay, index) => (
        <p key={index}>  {arrDay.name}  {'  '} {arrDay.day.toDateString()} </p>
      ));
    }

    return arr.map((arrDay, index) => (
      <p key={index}>{arrDay.toDateString()} </p>
    ));
  };

  const toggle = () => setModal(!modal);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSpinner(true);
  };

  const buttonText = () => {
    if (spinner) {
      return (
        <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
      );
    }
    return 'Submit';
  };

  const returnForm = () => (
    <div>
      <Form onSubmit={handleSubmit}>
        {error && <div className="errorFeedback"> {error} </div>}
        {/* suoervisor */}
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
              <option value="Paternity">Paternity Leave</option>
              <option value="Home">Home Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Sturdy">Sturdy Leave</option>
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
              onChange={(e) => setComment(e.target.value)}
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
              onChange={(date) => setLeaveDate(date)} />
          </InputGroup>
        </FormGroup>
        <div className="alert alert-info text-center" role="alert">
          { arrayOfLeaveDays.length > 0
          && <>
            <h5>You have selected {arrayOfLeaveDays.length} leave day(s)</h5>
            { arrayOfDays2Str(arrayOfLeaveDays)}
          </>}

          {arrayOfWeekends.length > 0
          && <>
            <h5>You have {arrayOfWeekends.length} Weekend day(s)</h5>
            {arrayOfDays2Str(arrayOfWeekends)}
          </> }

          {arrayOfHolidays.length > 0
          && <>
            <h5>You have {arrayOfHolidays.length} Public Holiday(s)</h5>
            {arrayOfDays2Str(arrayOfHolidays, 'holiday')}
          </>}
        </div>
        <button className="submitButton" type="submit">
          {buttonText()}
        </button>
        <Button color="secondary" onClick={toggle} className="float-right">Cancel</Button>
      </Form>
    </div>
  );

  const [publicHolidaysFeedback, setPublicHolidaysFeedback] = useState('');

  useEffect(() => {
    setPublicHolidaysFeedback('Retrieving Public Holidays, Please wait ..... ');
    const endPoint = `${BASE_URL}hrApi/getPublicHolidays`;
    axios.get(endPoint)
      .then((res) => {
        setPublicHolidaysFeedback('');
        setHolidays(res.data);
      })
      .catch((err) => {
        if (err && err.response && err.response.data && err.response.data.message) {
          setPublicHolidaysFeedback(err.response.data.message);
        } else {
          setPublicHolidaysFeedback(err.message);
        }
      });
  }, []);

  if (publicHolidaysFeedback) {
    return <div className="alert alert-info text-center" role="alert">
      <p><Spinner color="primary" style={{ width: '3rem', height: '3rem' }} /></p>
      <p>{ publicHolidaysFeedback }</p>
    </div>;
  }


  return (
    <div className="inlineItem">
      <button className="submitButton positionBtn" onClick={toggle}>
        <IoMdAdd />
            Apply For Leave
      </button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Apply For Leave</ModalHeader>
        <ModalBody>
          {returnForm()}
        </ModalBody>
      </Modal>
    </div>
  );
}


Plan4LeaveModal.propTypes = {
  supervisor: PropTypes.string,
  gender: PropTypes.string
};