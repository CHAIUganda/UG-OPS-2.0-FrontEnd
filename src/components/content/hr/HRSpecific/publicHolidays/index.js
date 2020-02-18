import React, { useState, useEffect } from 'react';
// prettier-ignore
import {
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Spinner
} from 'reactstrap';

import './publicHolidays.css';

export default function ManagePublicHolidays() {
  const [publicHolidays, setPublicHolidays] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [error, setError] = useState('');
  const [date, setDate] = useState('');
  const [holidayName, setHolidayName] = useState('');

  const handleSubmit = (event) => {
    debugger;
    event.preventDefault();
    setSpinner(true);
    const x = publicHolidays;
    x.push({
      name: holidayName,
      date
    });
    setPublicHolidays(x);
    setSpinner(false);
    setHolidayName('');
    setDate('');
  };

  const handleChange = (event) => {
    event.preventDefault();
    setError('');
    const { name, value } = event.target;
    if (name === 'holidayName') {
      setHolidayName(value);
    } else {
      setDate(value);
    }
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
    <div className="SigninFormStyle">
      <Form onSubmit={handleSubmit}>
        <h3 className="signInHeading">Create a new Public Holiday</h3>
        {error && <div className="errorFeedback"> {error} </div>}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Name</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Name of the Public Holiday"
              type="text"
              name="holidayName"
              value={holidayName}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>date (DD/MM)</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="DD/MM"
              type="text"
              value={date}
              onChange={handleChange}
              required
              name="date"
            />
          </InputGroup>
        </FormGroup>
        <button className="submitButton" type="submit">
          {buttonText()}
        </button>
      </Form>
    </div>
  );

  useEffect(() => {
    const x = [
      {
        name: 'xmass',
        date: '25/12'
      },
      {
        name: 'day 2',
        date: '09/10'
      }
    ];
    setPublicHolidays(x);
  }, []);

  return (
    <div>
      <h2>Manage Public Holidays</h2>
      {returnForm()}
      <table className="table holidaysTable">
        <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Date(DD/MM)</th>
            <th scope="col">Manage</th>
          </tr>
        </thead>
        <tbody>
          {
            publicHolidays.map((holiday, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{holiday.name}</td>
                <td>{holiday.date}</td>
                <td><button type="button" className="btn btn-danger btn-sm">Delete</button></td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}
