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
import { BASE_URL, returnStatusClass } from '../../../../config';
import './register.css';

const mapStateToProps = (state) => ({
  token: state.auth.token
});

function Register({ token }) {
  const [email, setEmail] = useState('@clintonhealthaccess.org');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otherNames, setOtherNames] = useState('');
  const [birthDate, setBirthDate] = useState();
  const [team, setTeam] = useState('Country Office');
  const [contractType, setContractType] = useState('Full-Time');
  const [contractStartDate, setContractStartDate] = useState(new Date());
  const [contractEndDate, setContractEndDate] = useState(new Date());
  const [workPermitStartDate, setWorkPermitStartDate] = useState();
  const [workPermitEndDate, setWorkPermitEndDate] = useState();
  const [password, setPassword] = useState('123456');
  const [confirmPass, setConfirmPass] = useState('123456');
  const [gender, setGender] = useState('Female');
  const [position, setPosition] = useState('');
  const [admin, setAdmin] = useState(false);
  const [supervisor, setSupervisor] = useState(false);
  const [humanResource, setHumanResource] = useState(false);
  const [staffCategory, setStaffCategory] = useState('national');
  const [programme, setProgramme] = useState('');
  const [allProgrammes, setAllProgrammes] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [error, setError] = useState('');
  const [countryDirector, setCountryDirector] = useState(false);
  const [supervisorsEmail, setSupervisorsEmail] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [submitSpinner, setSubmitSpinner] = useState(false);
  const [successFeedback, setSuccessFeedback] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [Currency, setCurrency] = useState('UGX');
  const [bankAccounts, setBankAccounts] = useState([]);
  const [nssfNumber, setNssfNumber] = useState('');
  const [tinNumber, setTinNumber] = useState('');

  const reset = () => {
    setEmail('@clintonhealthaccess.org');
    setFirstName('');
    setLastName('');
    setOtherNames('');
    setBirthDate();
    setBankName('');
    setAccountNumber('');
    setTeam('');
    setContractType('Full-Time');
    setContractStartDate(new Date());
    setContractEndDate(new Date());
    setPassword('123456');
    setConfirmPass('123456');
    setGender('female');
    setPosition('');
    setAdmin(false);
    setSupervisor(false);
    setHumanResource(false);
    setStaffCategory('national');
    setProgramme('');
    setSpinner(false);
    setCountryDirector(false);
    setSubmitSpinner(false);
    setNssfNumber('');
    setTinNumber('');
    setBankAccounts([]);
    setWorkPermitEndDate();
    setWorkPermitStartDate();
  };

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

    if (!birthDate) {
      setError('Please select a birth date.');
      setSubmitSpinner(false);
      return;
    }

    const newUSer = {
      fName: firstName,
      lName: lastName,
      birthDate,
      bankName,
      accountNumber,
      contractStartDate,
      contractEndDate,
      contractType,
      gender,
      admin,
      hr: humanResource,
      supervisor,
      countryDirector,
      title: position,
      programId: programme,
      type: staffCategory,
      team,
      supervisorEmail: supervisorsEmail,
      oNames: otherNames,
      email,
      bankAccounts,
      password,
      nssfNumber,
      tinNumber,
      workPermitStartDate,
      workPermitEndDate
    };

    axios.defaults.headers.common = { token };
    const apiRoute = `${BASE_URL}auth/registerUser`;
    axios.post(apiRoute, newUSer)
      . then(() => {
        setSubmitSpinner(false);
        setSuccessFeedback(`${firstName} ${lastName} Created successfully`);
        reset();
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

  const handleNewBankAccount = (event) => {
    event.preventDefault();
    if (!bankName) {
      setError('Please enter a bank to add account');
    } else if (!accountNumber) {
      setError('Please enter an account number to add account');
    } else {
      setBankAccounts([...bankAccounts,
        {
          bankName,
          accountNumber,
          Currency,
          status: 'To be saved'
        }
      ]);
      setBankName('');
      setAccountNumber('');
      setCurrency('UGX');
    }
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
              <InputGroupText>Birth Date</InputGroupText>
            </InputGroupAddon>
            <Calendar
              value={birthDate}
              onChange={(date) => setBirthDate(date)}
            />
          </InputGroup>
        </FormGroup>

        <div className="bankDetailsSection">
          <h5>Bank Details</h5>
          {error && <div className="errorFeedback"> {error} </div>}
          <table className="table holidaysTable">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Bank</th>
                <th scope="col">Account No_</th>
                <th scope="col">Currency</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {
                bankAccounts.map((bankAccount, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{bankAccount.bankName}</td>
                    <td>{bankAccount.accountNumber}</td>
                    <td>{bankAccount.Currency}</td>
                    <td className={
                      returnStatusClass(bankAccount.status)
                    }>
                      {bankAccount.status}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>

          <FormGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>Bank Name</InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Bank Name"
                type="text"
                value={bankName}
                onChange={(e) => {
                  setSuccessFeedback('');
                  setError('');
                  setBankName(e.target.value);
                }}
              />
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>Bank Account Number</InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Bank Account Number"
                type="text"
                value={accountNumber}
                onChange={(e) => {
                  setSuccessFeedback('');
                  setError('');
                  setAccountNumber(e.target.value);
                }}
              />
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>Currency</InputGroupText>
              </InputGroupAddon>
              <CustomInput
                type="select"
                id="exampleCustomSelect"
                name="customSelect"
                value={Currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="UGx">UGX</option>
                <option value="USD">USD</option>
              </CustomInput>
            </InputGroup>
          </FormGroup>

          <button
            className="submitButton"
            onClick={handleNewBankAccount}
          >
            Add New Account
          </button>
        </div>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>NSSF Number</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="NSSF Number"
              type="text"
              value={nssfNumber}
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setNssfNumber(e.target.value);
              }}
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>TIN Number</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="TIN Number"
              type="text"
              value={tinNumber}
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setTinNumber(e.target.value);
              }}
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
              <option value="Female">Female</option>
              <option value="Male">Male</option>
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
              <option value="national">national</option>
              <option value="expat">expat</option>
              <option value="tcn">tcn</option>
            </CustomInput>
          </InputGroup>
        </FormGroup>

        {
          (staffCategory === 'tcn' || staffCategory === 'expat')
          && (<>
            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Work Permit Start Date</InputGroupText>
                </InputGroupAddon>
                <Calendar
                  value={contractStartDate}
                  onChange={(date) => setWorkPermitStartDate(date)}
                />
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Work Permit End Date</InputGroupText>
                </InputGroupAddon>
                <Calendar
                  value={contractEndDate}
                  onChange={(date) => setWorkPermitEndDate(date)}
                />
              </InputGroup>
            </FormGroup>
          </>
          )
        }

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
              <option value=''>Not set</option>
              {
                allProgrammes.map((prog) => (
                  <option key={prog._id} value={prog._id}>{prog.name}</option>
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
