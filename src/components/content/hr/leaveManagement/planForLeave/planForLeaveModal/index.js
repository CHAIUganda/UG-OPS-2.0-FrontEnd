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
import { connect } from 'react-redux';
import axios from 'axios';
import moment from 'moment';

import { BASE_URL } from '../../../../../../config';
import './planLeaveModal.css';

const mapStateToProps = (state) => ({
  token: state.auth.token,
  type: state.auth.type
});

function Plan4LeaveModal({
  supervisor,
  gender,
  leaveDetails,
  type
}) {
  const [modal, setModal] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [error, setError] = useState('');
  const [supervisorName] = useState(`${supervisor.fName} ${supervisor.lName}`);
  const [category, setCategory] = useState('Annual');
  const [comment, setComment] = useState('');
  const [leaveDates, setLeaveDate] = useState();
  const [arrayOfLeaveDays, setArrayOfLeaveDays] = useState([]);
  const [arrayOfWeekends, setArrayOfWeekends] = useState([]);
  const [arrayOfHolidays, setArrayOfHolidays] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [greenContraintsFeedback, setGreenContraintsFeedback] = useState('');
  const [redContraintsFeedback, setRedContraintsFeedback] = useState('');

  const processAnnualLeaveFeedback = (leaveDaysArray, home = false) => {
    const daysAccruedByThen = leaveDates[1].getMonth() * 1.75;
    const availableDays = (Math.trunc(daysAccruedByThen) + leaveDetails.annualLeaveBF)
    - leaveDetails.annualLeaveTaken;
    const leaveWord = home ? 'Home' : 'Annual';
    if (availableDays >= leaveDaysArray.length) {
      setGreenContraintsFeedback(`
      You have ${leaveDetails.annualLeaveBF} annual leave days brought forward.
      You have used ${leaveDetails.annualLeaveTaken} annual leave days so far.
      You will have ${availableDays} annual leave day(s) by then, 
      and you have selected ${leaveDaysArray.length} ${leaveWord} day(s).
      You are good to go.
      `);
    } else {
      setRedContraintsFeedback(`
        You have ${leaveDetails.annualLeaveBF} annual leave days brought forward.
        You have used ${leaveDetails.annualLeaveTaken} annual leave days so far.
        You will have ${availableDays} annual leave day(s) by then, 
        However, you have selected ${leaveDaysArray.length} ${leaveWord} leave day(s)!
        Please reduce by ${leaveDaysArray.length - availableDays}
      `);
    }
  };

  const processMaternityLeaveFeedback = (leaveDaysArray) => {
    const availableDays = 60 - leaveDetails.maternityLeaveTaken;
    if (availableDays >= leaveDaysArray.length) {
      setGreenContraintsFeedback(`
      You have used ${leaveDetails.maternityLeaveTaken} maternity leave days so far.
      You will have ${availableDays} maternity leave day(s) by then, 
      and you have selected ${leaveDaysArray.length} leave day(s).
      You are good to go.
      `);
    } else {
      setRedContraintsFeedback(`
        You have used ${leaveDetails.maternityLeaveTaken} maternity leave days so far.
        You will have ${availableDays} maternity leave day(s) by then, 
        However, you have selected ${leaveDaysArray.length} day(s)!
        Please reduce by ${leaveDaysArray.length - availableDays}
      `);
    }
  };

  const processPaternityLeaveFeedback = (leaveDaysArray) => {
    const availableDays = 7;
    if (availableDays >= leaveDaysArray.length) {
      setGreenContraintsFeedback(`
      You have selected ${leaveDaysArray.length} paternity leave day(s).
      You are good to go.
      `);
    } else {
      setRedContraintsFeedback(`
        You are entitled to 7 paternity leave days per occurrence.
        However, you have selected ${leaveDaysArray.length} day(s)!
        Please reduce by ${leaveDaysArray.length - availableDays}
      `);
    }
  };

  const processStudyLeaveFeedback = (leaveDaysArray) => {
    const availableDays = 4 - leaveDetails.studyLeaveTaken;
    if (availableDays >= leaveDaysArray.length) {
      setGreenContraintsFeedback(`
      You have used ${leaveDetails.studyLeaveTaken} study leave days so far.
      You will have ${availableDays} study leave day(s) by then, 
      and you have selected ${leaveDaysArray.length} study leave day(s).
      You are good to go.
      `);
    } else {
      setRedContraintsFeedback(`
        You have used ${leaveDetails.studyLeaveTaken} study leave days so far.
        You will have ${availableDays} study leave day(s) by then, 
        However, you have selected ${leaveDaysArray.length} sturdy leave day(s)!
        Please reduce by ${leaveDaysArray.length - availableDays}
      `);
    }
  };

  const processUnpaidLeaveFeedback = (leaveDaysArray) => {
    const availableDays = 60 - leaveDetails.unPaidLeaveTaken;
    if (availableDays >= leaveDaysArray.length) {
      setGreenContraintsFeedback(`
      You have used ${leaveDetails.studyLeaveTaken} unpaid leave days so far.
      You will have ${availableDays} unpaid leave day(s) by then, 
      and you have selected ${leaveDaysArray.length} unpaid leave day(s).
      You are good to go.
      `);
    } else {
      setRedContraintsFeedback(`
        You have used ${leaveDetails.studyLeaveTaken} unpaid leave days so far.
        You will have ${availableDays} unpaid leave day(s) by then, 
        However, you have selected ${leaveDaysArray.length} unpaid leave day(s)!
        Please reduce by ${leaveDaysArray.length - availableDays}
      `);
    }
  };

  const leaveSpecificFeedback = (leaveDaysArray) => {
    if (category === 'Annual') {
      processAnnualLeaveFeedback(leaveDaysArray);
    } else if (category === 'Maternity') {
      processMaternityLeaveFeedback(leaveDaysArray);
    } else if (category === 'Paternity') {
      processPaternityLeaveFeedback(leaveDaysArray);
    } else if (category === 'Home') {
      processAnnualLeaveFeedback(leaveDaysArray, true);
    } else if (category === 'Study') {
      processStudyLeaveFeedback(leaveDaysArray);
    } else if (category === 'Unpaid') {
      processUnpaidLeaveFeedback(leaveDaysArray);
    }
  };

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
    setGreenContraintsFeedback('');
    setRedContraintsFeedback('');
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
      /* Next op goes here: check if annual */
      leaveSpecificFeedback(daysDetails.leaveDays);
    }
  };

  useEffect(() => {
    getLeaveDays();
  }, [leaveDates, category]);

  const arrayOfDays2Str = (arr, typeOfDay) => {
    if (arr.length === 0) {
      return '';
    }

    if (typeOfDay === 'holiday') {
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
    if (!arrayOfLeaveDays.length) {
      setError('Please select atleast a day to continue');
      return;
    }
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
              onChange={(date) => {
                setGreenContraintsFeedback('');
                setRedContraintsFeedback('');
                setError('');
                setLeaveDate(date);
              }
              } />
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
        { redContraintsFeedback
          && <div className="errorFeedback">
            {redContraintsFeedback}
          </div>
        }
        { greenContraintsFeedback
          && <div className="successFeedback">
            {greenContraintsFeedback}
          </div>
        }
        {
          !redContraintsFeedback
          && <button className="submitButton" type="submit">
            {buttonText()}
          </button>
        }
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
      <div><Spinner color="primary" style={{ width: '3rem', height: '3rem' }} /></div>
      <p>{ publicHolidaysFeedback }</p>
    </div>;
  }


  return (
    <div className="inlineItem">
      <button className="submitButton positionBtn" onClick={toggle}>
        <IoMdAdd />
            Plan For Leave
      </button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Plan For Leave</ModalHeader>
        <ModalBody>
          {returnForm()}
        </ModalBody>
      </Modal>
    </div>
  );
}


Plan4LeaveModal.propTypes = {
  supervisor: PropTypes.object,
  gender: PropTypes.string,
  leaveDetails: PropTypes.object,
  type: PropTypes.string
};

export default connect(mapStateToProps)(Plan4LeaveModal);
