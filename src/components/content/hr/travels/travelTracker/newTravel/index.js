import React, { useState } from 'react';
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

// eslint-disable-next-line no-empty-pattern
const NewTravel = ({ /* addNewEntry */ }) => {
  const [modal, setModal] = useState(false);
  const [formErr, setFormErr] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [travelLocation, setTravelLocation] = useState('');
  const [submitSpinner, setSubmitSpinner] = useState('');
  const [typeOfTrip, setTypeOfTrip] = useState('work');
  const [employeeContact, setEmployeeContact] = useState('');
  const [travelDates, setTravelDates] = useState('');

  const toggle = (event) => {
    event.preventDefault();
    setModal(!modal);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!travelDates) {
      setFormErr('Select a range of dates');
      setSubmitSpinner(false);
      return;
    }
    setSubmitSpinner(true);
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
  addNewEntry: PropTypes.func
};

export default NewTravel;
