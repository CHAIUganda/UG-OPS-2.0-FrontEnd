/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React, { useState } from 'react';
import {
  Button,
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
} from 'reactstrap';
import { IoMdAdd } from 'react-icons/io';
import axios from 'axios';
import Calendar from 'react-calendar';
import { useOktaAuth } from '@okta/okta-react';

import { BASE_URL } from '../../../../../../config';

const CreateNewPublicHoliday = ({ onNewPHoliday }) => {
  const [modal, setModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState('');
  const [formSpinner, setFormSpinner] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [holidayName, setHolidayName] = useState('');

  const { authService } = useOktaAuth();

  const toggle = () => setModal(!modal);

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormSpinner(true);
    setFormError('');
    setFormSuccessMessage('');
    const endPoint = `${BASE_URL}hrApi/createPublicHoliday`;
    if (!newDate) {
      setFormError('Please select a date to continue');
      setFormSpinner(false);
      return;
    }
    const holiday = {
      name: holidayName,
      date: `${newDate.getDate()}/${newDate.getMonth() + 1}`
    };

    axios.post(endPoint, holiday)
      .then((res) => {
        setFormSpinner(false);
        setHolidayName('');
        setNewDate();
        onNewPHoliday(res.data.holidaytoSave);
        setFormSuccessMessage(`${holiday.name} Created successfully`);
      })
      .catch((err) => {
        setFormSpinner(false);

        if (err && err.response && err.response.status && err.response.status === 401) {
          authService.logout('/');
        }

        if (err && err.response && err.response.data && err.response.data.message) {
          setFormError(err.response.data.message);
        } else {
          setFormError(err.message);
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
    }
  };

  const handleDateChange = (d) => {
    setFormSpinner(false);
    setFormError('');
    setFormSuccessMessage('');
    setNewDate(d);
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
    <div className="PublicFormStyle">
      <Form onSubmit={handleSubmit}>
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
              <InputGroupText>date</InputGroupText>
            </InputGroupAddon>
            <Calendar
              onChange={handleDateChange}
              value={newDate}
            />
          </InputGroup>
        </FormGroup>
        <button className="submitButton" type="submit">
          {buttonText()}
        </button>
        <Button color="secondary" onClick={toggle} className="float-right">Close</Button>
      </Form>
    </div>
  );

  return (
    <div className="inlineItem">
      <button className="submitButton positionBtn" onClick={toggle}>
        < IoMdAdd />
          Create New Public Holiday
      </button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Create a new Public Holiday</ModalHeader>
        <ModalBody>
          {returnForm()}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default CreateNewPublicHoliday;
