import React, { useState, useEffect } from 'react';
// prettier-ignore
import {
  Form,
  FormGroup,
  Input,
  CustomInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Spinner
} from 'reactstrap';
import Calendar from 'react-calendar';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './planForLeave.css';

const mapStateToProps = (state) => ({
  supervisor: state.auth.supervisor,
  gender: state.auth.gender
});

function Plan4Leave({ supervisor, gender }) {
  const [error] = useState('');
  const [spinner, setSpinner] = useState(false);
  const [category, setCategory] = useState('Annual');
  // const [status] = useState('Planned');
  const [leaveDates, setLeaveDate] = useState();
  const [comment, setComment] = useState('');
  const [supervisorName] = useState(supervisor);
  const [arrayOfLeaveDays, setArrayOfLeaveDays] = useState([]);
  const [arrayOfWeekends, setArrayOfWeekends] = useState([]);

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

  const arrayOfDays2Str = (arr) => {
    if (arr.length === 0) {
      return '';
    }
    return arr.map((arrDay, index) => (
      <p key={index}> {arrDay.toDateString()} </p>
    ));
  };

  const filterLeaveDays = (selectedDays) => {
    const leaveDays = [];
    const weekendDays = [];

    selectedDays.forEach((day) => {
      if (day.getDay() === 0 || day.getDay() === 6) {
        weekendDays.push(day);
      } else {
        leaveDays.push(day);
      }
    });

    return {
      leaveDays,
      weekendDays
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
    }
  };

  useEffect(() => {
    getLeaveDays();
  }, [leaveDates]);

  return (
    <div className="hrFormStyle">
      <Form onSubmit={handleSubmit}>
        <h5 className="hrHeading">Plan For Your Leave</h5>
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
        <div className="alert alert-info" role="alert">
          { arrayOfLeaveDays.length > 1
          && <h5>You have selected {arrayOfLeaveDays.length} leave days</h5> }
          {arrayOfDays2Str(arrayOfLeaveDays)}

          {arrayOfWeekends.length > 1
          && <h5>You have selected {arrayOfWeekends.length} Weekend days</h5> }
          {arrayOfDays2Str(arrayOfWeekends)}
        </div>
        <button className="submitButton" type="submit">
          {buttonText()}
        </button>
      </Form>
    </div>
  );
}

Plan4Leave.propTypes = {
  supervisor: PropTypes.string,
  gender: PropTypes.string
};

export default connect(mapStateToProps)(Plan4Leave);
