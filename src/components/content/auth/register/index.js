import React, { useState, useEffect } from 'react';
// prettier-ignore
import {
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  CustomInput,
  Spinner
} from 'reactstrap';
import Calendar from 'react-calendar';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import Select from 'react-select';

import CommonSpinner from '../../../common/spinner';
import { BASE_URL } from '../../../../config';
import './register.css';

const mapStateToProps = (state) => ({
  token: state.auth.token
});

function Register({ token }) {
  const [email, setEmail] = useState('@clintonhealthaccess.org');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otherNames, setOtherNames] = useState('');
  const [team, setTeam] = useState(false);
  const [contractType, setContractType] = useState('Full-Time');
  const [contractStartDate, setContractStartDate] = useState(new Date());
  const [contractEndDate, setContractEndDate] = useState(new Date());
  const [password, setPassword] = useState('123456');
  const [confirmPass, setConfirmPass] = useState('123456');
  const [gender, setGender] = useState('female');
  const [position, setPosition] = useState('');
  const [admin, setAdmin] = useState(false);
  const [supervisor, setSupervisor] = useState(false);
  const [humanResource, setHumanResource] = useState(false);
  const [staffCategory, setStaffCategory] = useState('local');
  const [programme, setProgramme] = useState('');
  const [allProgrammes, setAllProgrammes] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [error, setError] = useState('');
  const [countryDirector, setCountryDirector] = useState(false);
  const [supervisorsEmail, setSupervisorsEmail] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [submitSpinner, setSubmitSpinner] = useState(false);
  const [successFeedback, setSuccessFeedback] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setSuccessFeedback('');
    setSubmitSpinner(true);
    setError('');
    if (!supervisorsEmail) {
      setError('Please select for the person a supervisor.');
      setSubmitSpinner(false);
      return;
    }

    const newUSer = {
      fName: firstName,
      lName: lastName,
      contractStartDate,
      contractEndDate,
      contractType,
      gender,
      admin,
      hr: humanResource,
      supervisor,
      countryDirector,
      title: position,
      program: programme,
      type: staffCategory,
      team,
      supervisorEmail: supervisorsEmail,
      oNames: otherNames,
      email,
      password
    };

    axios.defaults.headers.common = { token };
    const apiRoute = `${BASE_URL}auth/registerUser`;
    axios.post(apiRoute, newUSer)
      . then(() => {
        setSubmitSpinner(false);
        setSuccessFeedback(`${firstName} ${lastName} Created successfully`);
      })
      .catch((err) => {
        setSubmitSpinner(false);
        if (err && err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      });
  };

  const getUsers = () => {
    axios.defaults.headers.common = { token };
    const apiRoute = `${BASE_URL}auth/getUsers`;
    axios.get(apiRoute)
      . then((res) => {
        setSpinner(false);
        const arrayToSet = res.data.map((user) => ({
          label: `${user.fName} ${user.lName}`,
          value: user.email
        }));
        setAllUsers(arrayToSet);
      })
      .catch((err) => {
        setSpinner(false);
        if (err && err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      });
  };

  useEffect(() => {
    setSpinner(true);
    axios.defaults.headers.common = { token };
    const apiRoute = `${BASE_URL}hrApi/getPrograms`;
    axios.get(apiRoute)
      . then((res) => {
        setSpinner(false);
        setAllProgrammes(res.data);
        getUsers();
      })
      .catch((err) => {
        setSpinner(false);
        if (err && err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      });
  }, []);

  const onSelectSupervisorEmail = (value) => {
    setSuccessFeedback('');
    setError('');
    setSupervisorsEmail(value);
  };

  const buttonText = () => {
    if (submitSpinner) {
      return (
        <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
      );
    }
    return 'Submit';
  };

  return (
    <div className="registerFormStyle">
      <Form onSubmit={handleSubmit}>
        <h3 className="registerHeading">Register For UG OPS</h3>
        {
          spinner
          && <div className="alert alert-info text-center" role="alert">
            <div><CommonSpinner /></div>
            <p>Getting things ready.....</p>
          </div>
        }
        {error && <div className="errorFeedback"> {error} </div>}
        {successFeedback && <div className="successFeedback"> {successFeedback} </div>}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>@ Email</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="email@clintonhealthaccess.org"
              type="email"
              value={email}
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setEmail(e.target.value);
              }}
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
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setFirstName(e.target.value);
              }}
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
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setLastName(e.target.value);
              }}
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
              placeholder="Optional"
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
              <InputGroupText>Category Of Staff</InputGroupText>
            </InputGroupAddon>
            <CustomInput
              type="select"
              id="staffCategoryCustomSelect"
              name="customSelect"
              value={staffCategory}
              onChange={(e) => setStaffCategory(e.target.value)}
            >
              <option value="local">local</option>
              <option value="expat">expat</option>
              <option value="tcn">tcn</option>
            </CustomInput>
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Team</InputGroupText>
            </InputGroupAddon>
            <CustomInput
              type="select"
              id="teamCustomSelect"
              name="customSelect"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
            >
              <option value="Country Office">Country Office</option>
              <option value="Global">Global</option>
            </CustomInput>
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Programme</InputGroupText>
            </InputGroupAddon>
            <CustomInput
              type="select"
              id="programmeCustomSelect"
              name="customSelect"
              value={programme}
              onChange={(e) => setProgramme(e.target.value)}
            >
              {
                allProgrammes.map((prog) => (
                  <option key={prog._id} value={prog.name}>{prog.name}</option>
                ))
              }
            </CustomInput>
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>System Admin</InputGroupText>
            </InputGroupAddon>
            <div className="intSwitch">
              <CustomInput
                type="switch"
                id="adminSwitch2"
                name="customSwitch"
                checked={admin}
                onChange={(e) => setAdmin(e.target.checked)}
              />
            </div>
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Is the person a supervisor?</InputGroupText>
            </InputGroupAddon>
            <div className="intSwitch">
              <CustomInput
                type="switch"
                id="supervisorSwitch2"
                name="customSwitch"
                checked={supervisor}
                onChange={(e) => setSupervisor(e.target.checked)}
              />
            </div>
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Human Resource</InputGroupText>
            </InputGroupAddon>
            <div className="intSwitch">
              <CustomInput
                type="switch"
                id="hrSwitch2"
                name="customSwitch"
                checked={humanResource}
                onChange={(e) => setHumanResource(e.target.checked)}
              />
            </div>
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Country Director</InputGroupText>
            </InputGroupAddon>
            <div className="intSwitch">
              <CustomInput
                type="switch"
                id="cdSwitch2"
                name="customSwitch"
                checked={countryDirector}
                onChange={(e) => setCountryDirector(e.target.checked)}
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
              <InputGroupText>person&apos;s Supervisor</InputGroupText>
            </InputGroupAddon>
            <div className="selectCustomStyle">
              <Select
                options={allUsers}
                onChange={(opt) => onSelectSupervisorEmail(opt.value)}
              />
            </div>
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

        {error && <div className="errorFeedback"> {error} </div>}
        {successFeedback && <div className="successFeedback"> {successFeedback} </div>}

        <button className="submitButton" type="submit">
          {buttonText()}
        </button>
      </Form>
    </div>
  );
}

Register.propTypes = {
  token: PropTypes.string
};

export default connect(mapStateToProps)(Register);
