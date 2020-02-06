import React, { useState } from 'react';
// prettier-ignore
import {
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  CustomInput
} from 'reactstrap';
import Calendar from 'react-calendar';

import './register.css';

export default function Register() {
  const [email, setEmail] = useState('a@a');
  const [firstName, setFirstName] = useState('a');
  const [lastName, setLastName] = useState('a');
  const [otherNames, setOtherNames] = useState('a');
  const [internationalStaff, setInternationalStaff] = useState(false);
  const [contractType, setContractType] = useState('Full-Time');
  const [contractStartDate, setContractStartDate] = useState(new Date());
  const [contractEndDate, setContractEndDate] = useState(new Date());

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(contractType);
  };

  return (
    <div className="registerFormStyle">
      <Form onSubmit={handleSubmit}>
        <h3 className="registerHeading">Register For UG OPS</h3>
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>@ Email</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="email@clintonhealthaccess.org"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>First Name</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="First Name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Last Name</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Other Names</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Other Names"
              type="text"
              value={otherNames}
              onChange={(e) => setOtherNames(e.target.value)}
              required
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>International staff</InputGroupText>
            </InputGroupAddon>
            <div className="intSwitch">
              <CustomInput
                type="switch"
                id="exampleCustomSwitch"
                name="customSwitch"
                checked={internationalStaff}
                onChange={(e) => setInternationalStaff(e.target.checked)}
              />
            </div>
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Contract Type</InputGroupText>
            </InputGroupAddon>
            <CustomInput
              type="select"
              id="exampleCustomSelect"
              name="customSelect"
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Volunteer">Volunteer</option>
            </CustomInput>
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Contract Start Date</InputGroupText>
            </InputGroupAddon>
            <Calendar
              value={contractStartDate}
              onChange={(date) => setContractStartDate(date)}
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Contract End Date</InputGroupText>
            </InputGroupAddon>
            <Calendar
              value={contractEndDate}
              onChange={(date) => setContractEndDate(date)}
            />
          </InputGroup>
        </FormGroup>

        <button className="submitButton" type="submit">
          Submit
        </button>
      </Form>
    </div>
  );
}
