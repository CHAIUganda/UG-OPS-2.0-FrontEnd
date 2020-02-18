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
import axios from 'axios';

import { BASE_URL } from '../../../../../config';

import './publicHolidays.css';

export default function ManagePublicHolidays() {
  const [publicHolidays, setPublicHolidays] = useState([]);
  const [formSpinner, setFormSpinner] = useState(false);
  const [formError, setFormError] = useState('');
  const [date, setDate] = useState('');
  const [holidayName, setHolidayName] = useState('');
  const [tableSpinner, setTableSpinner] = useState(false);
  const [tableError, setTableError] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormSpinner(true);
    setFormError('');
    setFormSuccessMessage('');
    const endPoint = `${BASE_URL}hrApi/createPublicHoliday`;
    const holiday = {
      name: holidayName,
      date
    };

    axios.post(endPoint, holiday)
      .then((res) => {
        // debugger;
        setFormSpinner(false);
        setHolidayName('');
        setDate('');
        setPublicHolidays([...publicHolidays, res.data.holidaytoSave]);
        setFormSuccessMessage(`${holiday.name} Created successfully`);
      })
      .catch((err) => {
        setFormSpinner(false);
        if (err && err.response && err.response.data && err.response.data.message) {
          setFormError(err.response.data.message);
        } else {
          setFormError(err.message);
        }
      });
  };

  const handleDeleteHoliday = (event, id) => {
    event.preventDefault();
    // eslint-disable-next-line no-param-reassign
    event.currentTarget.className = 'disappear';
    // "btn btn-danger btn-sm"
    setFormError('');
    setFormSuccessMessage('');
    const endPoint = `${BASE_URL}hrApi/removePublicHoliday`;
    const holiday = { id };

    axios.post(endPoint, holiday)
      .then(() => {
        const newHolidays = publicHolidays.filter((hol) => hol._id !== id);
        setPublicHolidays(newHolidays);
      })
      .catch((err) => {
        if (err && err.response && err.response.data && err.response.data.message) {
          setTableError(err.response.data.message);
        } else {
          setTableError(err.message);
        }
      });
  };

  const handleChange = (event) => {
    event.preventDefault();
    setFormError('');
    setFormSuccessMessage('');
    const { name, value } = event.target;
    if (name === 'holidayName') {
      setHolidayName(value);
    } else {
      setDate(value);
    }
  };

  const buttonText = () => {
    if (formSpinner) {
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
        {formError && <div className="errorFeedback"> {formError} </div>}
        {formSuccessMessage && <div className="successFeedback"> {formSuccessMessage} </div>}
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

  const returnTable = () => {
    if (tableError) {
      return <div className="errorFeedback">{ tableError }</div>;
    }

    if (tableSpinner) {
      return <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />;
    }

    return (
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
              <tr key={holiday._id}>
                <th scope="row">{index + 1}</th>
                <td>{holiday.name}</td>
                <td>{holiday.date}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={(event) => handleDeleteHoliday(event, holiday._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  };

  useEffect(() => {
    setTableSpinner(true);
    setTableSpinner('');
    const endPoint = `${BASE_URL}hrApi/getPublicHolidays`;
    axios.get(endPoint)
      .then((res) => {
        setTableSpinner(false);
        setPublicHolidays(res.data);
      })
      .catch((err) => {
        setTableSpinner(false);
        if (err && err.response && err.response.data && err.response.data.message) {
          setTableError(err.response.data.message);
        } else {
          setTableError(err.message);
        }
      });
  }, []);

  return (
    <div>
      <h2>Manage Public Holidays</h2>
      {returnForm()}
      {returnTable()}
    </div>
  );
}
