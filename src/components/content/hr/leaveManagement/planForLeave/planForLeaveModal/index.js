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
  FormText
} from 'reactstrap';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';
import { connect } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import { useOktaAuth } from '@okta/okta-react';

import getDatesInBetween from '../../../../../common/getDatesBetween';
import { BASE_URL } from '../../../../../../config';
import './planLeaveModal.css';

const mapStateToProps = (state) => ({
  token: state.auth.token,
  type: state.auth.type,
  email: state.auth.email
});

function Plan4LeaveModal({
  supervisor,
  gender,
  leaveDetails,
  type,
  email,
  token,
  addLeave
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
  const [successFeedback, setSuccessFeedback] = useState('');

  const { authService } = useOktaAuth();

  const reset = () => {
    setError('');
    setCategory('Annual');
    setComment('');
    setLeaveDate();
    setArrayOfLeaveDays([]);
    setArrayOfWeekends([]);
    setArrayOfHolidays([]);
    setHolidays([]);
    setGreenContraintsFeedback('');
    setRedContraintsFeedback('');
  };


  const processAnnualLeaveFeedback = (leaveDaysArray, home = false) => {
    const daysAccruedByThen = leaveDetails.annualLeaveBal;
    const availableDays = (Math.trunc(daysAccruedByThen) + leaveDetails.annualLeaveBF)
    - leaveDetails.annualLeaveTaken;
    const leaveWord = home ? 'Home' : 'Annual';
    if (availableDays >= leaveDaysArray.length) {
      setGreenContraintsFeedback(`
      You have ${leaveDetails.annualLeaveBF} annual leave days brought forward.
      You have planned for ${leaveDetails.annualLeavePlanned} annual leave days.
      You have used ${leaveDetails.annualLeaveTaken} annual leave days so far.
      You will have ${availableDays} annual leave day(s) by then, 
      and you have selected ${leaveDaysArray.length} ${leaveWord} day(s).
      You are good to go.
      `);
    } else {
      setRedContraintsFeedback(`
        You have ${leaveDetails.annualLeaveBF} annual leave days brought forward.
        You have planned for ${leaveDetails.annualLeavePlanned} annual leave days.
        You have used ${leaveDetails.annualLeaveTaken} annual leave days so far.
        You will have ${availableDays} annual leave day(s) by then, 
        However, you have selected ${leaveDaysArray.length} ${leaveWord} leave day(s)!
        Please reduce by ${leaveDaysArray.length - availableDays}
        You can cancel some planned annual leaves if any to avail more days.
      `);
    }
  };

  const processMaternityLeaveFeedback = (leaveDaysArray) => {
    const availableDays = leaveDetails.maternityLeaveBal;
    if (availableDays >= leaveDaysArray.length) {
      setGreenContraintsFeedback(`
      You have used ${leaveDetails.maternityLeaveTaken} maternity leave days so far.
      You have planned for ${leaveDetails.maternityLeavePlanned} maternity leave days.
      You will have ${availableDays} maternity leave day(s) by then, 
      and you have selected ${leaveDaysArray.length} leave day(s).
      You are good to go.
      `);
    } else {
      setRedContraintsFeedback(`
        You have used ${leaveDetails.maternityLeaveTaken} maternity leave days so far.
        You have planned for ${leaveDetails.maternityLeavePlanned} maternity leave days.
        You will have ${availableDays} maternity leave day(s) by then, 
        However, you have selected ${leaveDaysArray.length} day(s)!
        Please reduce by ${leaveDaysArray.length - availableDays}
        You can cancel some planned maternity leaves if any to avail more days.
      `);
    }
  };

  const processPaternityLeaveFeedback = (leaveDaysArray) => {
    const availableDays = 7;
    if (availableDays >= leaveDaysArray.length) {
      setGreenContraintsFeedback(`
      You have selected ${leaveDaysArray.length} paternity leave day(s).
      You are good to go.`);
    } else {
      setRedContraintsFeedback(`
        You are entitled to 7 paternity leave days per occurrence.
        However, you have selected ${leaveDaysArray.length} day(s)!
        Please reduce by ${leaveDaysArray.length - availableDays}
      `);
    }
  };

  const processStudyLeaveFeedback = (leaveDaysArray) => {
    const availableDays = leaveDetails.studyLeaveBal;
    if (availableDays >= leaveDaysArray.length) {
      setGreenContraintsFeedback(`
      You have used ${leaveDetails.studyLeaveTaken} study leave days so far.
      You have planned for ${leaveDetails.studyLeavePlanned} study leave days.
      You will have ${availableDays} study leave day(s) by then, 
      and you have selected ${leaveDaysArray.length} study leave day(s).
      You are good to go.
      `);
    } else {
      setRedContraintsFeedback(`
        You have used ${leaveDetails.studyLeaveTaken} study leave days so far.
        You will have ${availableDays} study leave day(s) by then, 
        However, you have selected ${leaveDaysArray.length} study leave day(s)!
        Please reduce by ${leaveDaysArray.length - availableDays}.
        You can cancel some planned study leaves if any to avail more days.
      `);
    }
  };

  const processUnpaidLeaveFeedback = (leaveDaysArray) => {
    const availableDays = leaveDetails.unpaidLeaveBal;
    if (availableDays >= leaveDaysArray.length) {
      setGreenContraintsFeedback(`
      You have used ${leaveDetails.studyLeaveTaken} unpaid leave days so far.
      You have planned for ${leaveDetails.unPaidLeavePlanned} unpaid leave days.
      You will have ${availableDays} unpaid leave day(s) by then, 
      and you have selected ${leaveDaysArray.length} unpaid leave day(s).
      `);
    } else {
      setRedContraintsFeedback(`
        You have used ${leaveDetails.studyLeaveTaken} unpaid leave days so far.
        You will have ${availableDays} unpaid leave day(s) by then, 
        However, you have selected ${leaveDaysArray.length} unpaid leave day(s)!
        Please reduce by ${leaveDaysArray.length - availableDays}.
        You can cancel some planned unpaid leaves if any to avail more days.
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
    setSuccessFeedback('');
    setError('');

    if (leaveDates) {
      if (!leaveDates[0] || !leaveDates[1]) {
        setError('FE: Error setting the dates!');
        return;
      }
      const arrayOfDays = getDatesInBetween(leaveDates[0], leaveDates[1]);
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
    setSpinner(true);
    if (!arrayOfLeaveDays.length) {
      setError('Please select atleast a day to continue');
      setSpinner(false);
      return;
    }

    const leaveObject = {
      startDate: `${leaveDates[0].getFullYear()}-${leaveDates[0].getMonth() + 1}-${leaveDates[0].getDate()}`,
      endDate: `${leaveDates[1].getFullYear()}-${leaveDates[1].getMonth() + 1}-${leaveDates[1].getDate()}`,
      type: category,
      staffEmail: email,
      status: 'Planned',
      daysTaken: arrayOfLeaveDays.length,
      leaveDays: arrayOfLeaveDays,
      publicHolidays: arrayOfHolidays,
      comment,
    };

    axios.defaults.headers.common = { token };
    const endPoint = `${BASE_URL}leaveApi/leave`;
    axios.post(endPoint, leaveObject)
      .then((res) => {
        reset();
        setSpinner(false);
        setSuccessFeedback(res.data.message);
        addLeave(res.data.leave);
      })
      .catch((err) => {
        setSpinner(false);

        if (err.response.status === 401) {
          authService.logout('/');
        }

        if (err && err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      });
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
        { successFeedback
          && <div className="successFeedback">
            {successFeedback}
          </div>
        }
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
              && <option value="Maternity">Maternity Leave</option>
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
                setGreenContraintsFeedback('');
                setRedContraintsFeedback('');
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
                setGreenContraintsFeedback('');
                setRedContraintsFeedback('');
                setSuccessFeedback('');
                setError('');
                setLeaveDate(date);
              }
              } />
          </InputGroup>
          <FormText>
            To select a single date, double click on that date.
              To select a range of dates,
              single click on the first date and single click on the last date as well.
          </FormText>
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
        { successFeedback
          && <div className="successFeedback">
            {successFeedback}
          </div>
        }
        {error && <div className="errorFeedback"> {error} </div>}
        {
          !redContraintsFeedback
          && <button className="submitButton" type="submit">
            {buttonText()}
          </button>
        }
        <Button color="secondary" onClick={toggle} className="float-right">Close</Button>
      </Form>
    </div>
  );

  const [publicHolidaysFeedback, setPublicHolidaysFeedback] = useState('');

  useEffect(() => {
    setPublicHolidaysFeedback('Retrieving Public Holidays, Please wait ..... ');
    axios.defaults.headers.common = { token };
    const endPoint = `${BASE_URL}hrApi/getPublicHolidays`;
    axios.get(endPoint)
      .then((res) => {
        setPublicHolidaysFeedback('');
        setHolidays(res.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          authService.logout('/');
        }

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
  type: PropTypes.string,
  email: PropTypes.string,
  token: PropTypes.string,
  addLeave: PropTypes.func
};

export default connect(mapStateToProps)(Plan4LeaveModal);
