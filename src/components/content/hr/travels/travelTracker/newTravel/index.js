import React, { useState } from 'react';
import axios from 'axios';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Spinner,
  FormText
} from 'reactstrap';
import Calendar from 'react-calendar';
import PropTypes from 'prop-types';

const NewTravel = ({
  addNewEntry,
  BASE_URL,
  token,
  name,
  email,
  Cookies,
  logUserOut,
}) => {
  const [modal, setModal] = useState(false);
  const [formErr, setFormErr] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [travelLocation, setTravelLocation] = useState('');
  const [submitSpinner, setSubmitSpinner] = useState('');
  const [typeOfTrip, setTypeOfTrip] = useState('work');
  const [employeeContact, setEmployeeContact] = useState('');
  const [travelDates, setTravelDates] = useState();

  const toggle = (event) => {
    event.preventDefault();
    setModal(!modal);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitSpinner(true);

    if (!travelDates) {
      setFormErr('Select a range of dates');
      setSubmitSpinner(false);
      return;
    }

    const travelToCreate = {
      employeeName: name,
      employeeEmail: email,
      travelLocation,
      typeOTrip: typeOfTrip,
      dates: {
        travelDate: `${travelDates[0].getFullYear()}-${travelDates[0].getMonth() + 1}-${travelDates[0].getDate()}`,
        returnDate: `${travelDates[1].getFullYear()}-${travelDates[1].getMonth() + 1}-${travelDates[1].getDate()}`
      },
      employeeContact
    };

    const endPoint = `${BASE_URL}hrApi/submitTravel`;
    axios.defaults.headers.common = { token };
    axios.post(endPoint, travelToCreate)
      .then((res) => {
        addNewEntry(res.data.travel);
        setSuccessMessage(res.data.message);
        setTravelLocation('');
        setTypeOfTrip('work');
        setEmployeeContact('');
        setTravelDates();
        setSubmitSpinner(false);
      })
      .catch((err) => {
        setSubmitSpinner(false);

        if (err && err.response && err.response.status && err.response.status === 401) {
          Cookies.remove('token');
          logUserOut();
        }

        if (err && err.response && err.response.data && err.response.data.message) {
          setFormErr(err.response.data.message);
        } else {
          setFormErr(err.message);
        }
      });
  };

  return (
    <div className="inlineItem float-right mr-4">
      <button onClick={toggle} className="btn btn-outline-primary">Add New Travel</button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>New Travel Entry</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            {
              formErr && (
                <div className="alert alert-danger" role="alert">
                  {formErr}
                </div>
              )
            }

            {
              successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )
            }
            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Travel Location</InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Where you will be travelling to."
                  type="text"
                  name="travelLocation"
                  value={travelLocation}
                  onChange={(event) => {
                    event.preventDefault();
                    setFormErr('');
                    setSuccessMessage('');
                    setTravelLocation(event.target.value);
                  }}
                  required
                />
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Type Of Trip</InputGroupText>
                </InputGroupAddon>
                <select className="form-control" value={typeOfTrip} onChange={
                  (e) => {
                    setFormErr('');
                    setSuccessMessage('');
                    setTypeOfTrip(e.target.value);
                  }
                }>
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                </select>
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Employee Contact</InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Contact to reach you on."
                  type="text"
                  name="employeeContact"
                  value={employeeContact}
                  onChange={(event) => {
                    event.preventDefault();
                    setFormErr('');
                    setSuccessMessage('');
                    setEmployeeContact(event.target.value);
                  }}
                  required
                />
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Select Range of travel dates</InputGroupText>
                </InputGroupAddon>
                <Calendar
                  value={travelDates}
                  selectRange={true}
                  onChange={(date) => {
                    setSuccessMessage('');
                    setFormErr('');
                    setTravelDates(date);
                  }
                  } />
              </InputGroup>
              <FormText>
                To select a single date, double click on that date.
                To select a range of dates,
                single click on the first date and single click on the last date as well.
              </FormText>
            </FormGroup>

            {
              formErr && (
                <div className="alert alert-danger" role="alert">
                  {formErr}
                </div>
              )
            }

            {
              successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )
            }

            {
              submitSpinner
                ? (<button className="btn btn-outline-primary"><Spinner /></button>)
                : (<button type="submit" className="btn btn-outline-primary">Submit</button>)
            }

          </form>
        </ModalBody>
        <ModalFooter>
          <button onClick={toggle} className="btn btn-outline-secondary">close</button>
        </ModalFooter>
      </Modal>
    </div>
  );
};


NewTravel.propTypes = {
  addNewEntry: PropTypes.func,
  token: PropTypes.string,
  name: PropTypes.string,
  email: PropTypes.string,
  BASE_URL: PropTypes.string,
  Cookies: PropTypes.object,
  logUserOut: PropTypes.func
};

export default NewTravel;
