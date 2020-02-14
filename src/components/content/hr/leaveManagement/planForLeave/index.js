import React, { useState } from 'react';
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
  supervisor: state.auth.supervisor
});

function Plan4Leave({ supervisor }) {
  const [error] = useState('');
  const [spinner, setSpinner] = useState(false);
  const [category, setCategory] = useState('Annual');
  // const [status] = useState('Planned');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [comment, setComment] = useState('');
  const [supervisorName] = useState(supervisor);

  const handleSubmit = () => {
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
              <option value="Maternatiy">Maternity Leave</option>
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
        {/*  Start Date */}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Start Date</InputGroupText>
            </InputGroupAddon>
            <Calendar
              value={startDate}
              onChange={(date) => setStartDate(date)}
            />
          </InputGroup>
        </FormGroup>
        {/*  End Date */}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>End Date</InputGroupText>
            </InputGroupAddon>
            <Calendar value={endDate} onChange={(date) => setEndDate(date)} />
          </InputGroup>
        </FormGroup>
        <div className="alert alert-info" role="alert">
          You have chosen 4 days of leave
        </div>
        <button className="submitButton" type="submit">
          {buttonText()}
        </button>
      </Form>
    </div>
  );
}

Plan4Leave.propTypes = {
  supervisor: PropTypes.string
};

export default connect(mapStateToProps)(Plan4Leave);
