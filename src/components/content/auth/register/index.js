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
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otherNames, setOtherNames] = useState('');
  const [internationalStaff, setInternationalStaff] = useState(false);
  const [contractType, setContractType] = useState('Full-Time');
  const [contractStartDate, setContractStartDate] = useState(new Date());
  const [contractEndDate, setContractEndDate] = useState(new Date());
  const [programeManager, setProgrameManager] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [gender, setGender] = useState('female');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('Human-Resource');

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
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Gender</InputGroupText>
            </InputGroupAddon>
            <CustomInput
              type="select"
              id="exampleCustomSelect"
              name="customSelect"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
            </CustomInput>
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Position</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Assistant Programme Officer"
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Department</InputGroupText>
            </InputGroupAddon>
            <CustomInput
              type="select"
              id="exampleCustomSelect"
              name="customSelect"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="Human-Resource">Human-Resource</option>
              <option value="Finance">Finance</option>
              <option value="Country-Leadership-Team">
                Country-Leadership-Team
              </option>
              <option value="Procurement">Procurement</option>
              <option value="Transport">Transport</option>
              <option value="Vaccines">Vaccines</option>
              <option value="Infectious-and-Non-Communicable-Diseases">
                Infectious-and-Non-Communicable-Diseases
              </option>
              <option value="Integrated-Child-Health">
                Integrated-Child-Health
              </option>
              <option value="Sexual-Reproductive-Maternal-and-New-born-Health">
                Sexual-Reproductive-Maternal-and-New-born-Health
              </option>
            </CustomInput>
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

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>P.M or Supervisor&apos;s Email @</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="email@clintonhealthaccess.org"
              type="email"
              value={programeManager}
              onChange={(e) => setProgrameManager(e.target.value)}
              required
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>***</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>***</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Confirm Password"
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
            />
          </InputGroup>
        </FormGroup>

        <p className="readThru alert alert-info">
          Please read through and confirm the details provided before submitting
        </p>

        <button className="submitButton" type="submit">
          Submit
        </button>
      </Form>
    </div>
  );
}
