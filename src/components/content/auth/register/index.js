import React, { useState, useEffect } from 'react';
import {
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  CustomInput,
  Spinner,
  FormText
} from 'reactstrap';
import Calendar from 'react-calendar';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { useOktaAuth } from '@okta/okta-react';

import * as sideBarActions from '../../../../redux/actions/sideBarActions';
import * as authActions from '../../../../redux/actions/authActions';
import * as notificationActions from '../../../../redux/actions/notificationsActions';

import CommonSpinner from '../../../common/spinner';
import EditBankDetailsModal from '../editUser/editBankDetails';
import { BASE_URL, returnStatusClass } from '../../../../config';
import './register.css';

const matchDispatchToProps = {
  changeSection: sideBarActions.changeSection,
  changeActive: sideBarActions.changeActive,
  logUserIn: authActions.logUserIn,
  setInitialNotifications: notificationActions.setInitialNotifications
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
  roles: state.auth.roles
});

function Register({
  token,
  roles,
  changeSection,
  changeActive,
  setInitialNotifications,
  logUserIn
}) {
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
  const [deputyCountryDirector, setDeputyCountryDirector] = useState(false);
  const [procurementAdmin, setProcurementAdmin] = useState(false);
  const [securityTeam, setSecurityTeam] = useState(false);
  const [chaiProcurement, setChaiProcurement] = useState(false);
  const [financeAdmin, setFinanceAdmin] = useState(false);
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

  const { authState, authService } = useOktaAuth();

  if (token && roles) {
    if (!roles.hr && !roles.admin) {
      return (
        <div className="alert alert-danger text-center" role="alert">
          <p>{'FE: You have no access rights for this resource.'}</p>
        </div>
      );
    }
  }

  changeSection('Human Resource');
  changeActive('Register');

  const reset = () => {
    setEmail('@clintonhealthaccess.org');
    setFirstName('');
    setLastName('');
    setOtherNames('');
    setBirthDate();
    setBankName('');
    setAccountNumber('');
    setTeam('Country Office');
    setContractType('Full-Time');
    setContractStartDate(new Date());
    setContractEndDate(new Date());
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
      birthDate: `${birthDate.getFullYear()}-${birthDate.getMonth() + 1}-${birthDate.getDate()}`,
      bankName,
      accountNumber,
      contractStartDate: `${contractStartDate.getFullYear()}-${contractStartDate.getMonth() + 1}-${contractStartDate.getDate()}`,
      contractEndDate: `${contractEndDate.getFullYear()}-${contractEndDate.getMonth() + 1}-${contractEndDate.getDate()}`,
      contractType,
      gender,
      admin,
      hr: humanResource,
      supervisor,
      countryDirector,
      deputyCountryDirector,
      procurementAdmin,
      securityTeam,
      chaiProcurement,
      financeAdmin,
      title: position,
      programId: programme,
      type: staffCategory,
      team,
      supervisorEmail: supervisorsEmail,
      oNames: otherNames,
      email,
      bankAccounts,
      nssfNumber,
      tinNumber,
      workPermitStartDate:
        workPermitStartDate
          ? `${workPermitStartDate.getFullYear()}-${workPermitStartDate.getMonth() + 1}-${workPermitStartDate.getDate()}`
          : null,
      workPermitEndDate:
        workPermitEndDate
          ? `${workPermitEndDate.getFullYear()}-${workPermitEndDate.getMonth() + 1}-${workPermitEndDate.getDate()}`
          : null
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

        if (err && err.response && err.response.status && err.response.status === 401) {
          authService.logout('/');
        }

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

        if (err && err.response && err.response.status && err.response.status === 401) {
          authService.logout('/');
        }

        if (err && err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      });
  };

  const setUpUser = (tokenToSet) => {
    axios.defaults.headers.common = { token: tokenToSet };
    const apiRoute = `${BASE_URL}auth/getLoggedInUser`;
    axios.get(apiRoute)
      . then((res) => {
        const {
          department,
          fName,
          internationalStaff,
          lName,
          _id,
          supervisorDetails,
          notifications
        } = res.data;
        const genderToSet = res.data.gender;
        const emailToSet = res.data.email;
        const leaveDetailsToSet = res.data.leaveDetails;
        const positionToSet = res.data.position;

        const userObject = {
          ...res.data,
          email: emailToSet,
          token: tokenToSet,
          gender: genderToSet,
          internationalStaff,
          department,
          firstName: fName,
          lastName: lName,
          Position: positionToSet,
          id: _id,
          leaveDetails: leaveDetailsToSet,
          supervisor: supervisorDetails
        };
        setInitialNotifications(notifications);
        logUserIn(userObject);
        setSpinner(false);
      })
      .catch((err) => {
        setSpinner(false);

        if (err && err.response && err.response.status && err.response.status === 401) {
          authService.logout('/');
        }

        if (err && err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      });
  };

  const setUpThisPage = () => {
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

        if (err && err.response && err.response.status && err.response.status === 401) {
          authService.logout('/');
        }

        if (err && err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      });
  };

  useEffect(() => {
    setSpinner(true);
    setError('');

    if (token) {
      setUpThisPage();
    }

    if (!token && authState.isAuthenticated) {
      const { accessToken } = authState;
      setUpUser(`Bearer ${accessToken}`);
    }

    if (!token && !authState.isAuthenticated) {
      setSpinner(false);
      authService.logout('/');
    }
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
          status: 'ACTIVE'
        }
      ]);
      setBankName('');
      setAccountNumber('');
      setCurrency('UGX');
    }
  };

  const handleEditBankAccountAction = (index, modifiedAccountDetails) => {
    const holder = [...bankAccounts];
    holder[index] = modifiedAccountDetails;
    setBankAccounts(holder);
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
              <InputGroupText>Email</InputGroupText>
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
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setOtherNames(e.target.value);
              }}
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
          <FormText>
            To select a single date, double click on that date.
          </FormText>
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
                    <td>
                      <button
                        type="button">
                        <EditBankDetailsModal
                          bankDetails={bankAccount}
                          editAction={handleEditBankAccountAction}
                          index={index}
                        />
                      </button>
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
                onChange={(e) => {
                  setSuccessFeedback('');
                  setError('');
                  setCurrency(e.target.value);
                }}
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
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setGender(e.target.value);
              }}
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
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setPosition(e.target.value);
              }}
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
                  onChange={(date) => {
                    setSuccessFeedback('');
                    setError('');
                    setWorkPermitStartDate(date);
                  }}
                />
              </InputGroup>
              <FormText>
            To select a single date, double click on that date.
              </FormText>
            </FormGroup>

            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Work Permit End Date</InputGroupText>
                </InputGroupAddon>
                <Calendar
                  value={contractEndDate}
                  onChange={(date) => {
                    setSuccessFeedback('');
                    setError('');
                    setWorkPermitEndDate(date);
                  }}
                />
              </InputGroup>
              <FormText>
            To select a single date, double click on that date.
              </FormText>
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
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setTeam(e.target.value);
              }}
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
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setProgramme(e.target.value);
              }}
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
                onChange={(e) => {
                  setSuccessFeedback('');
                  setError('');
                  setAdmin(e.target.checked);
                }}
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
                onChange={(e) => {
                  setSuccessFeedback('');
                  setError('');
                  setSupervisor(e.target.checked);
                }}
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
                onChange={(e) => {
                  setSuccessFeedback('');
                  setError('');
                  setHumanResource(e.target.checked);
                }}
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
                onChange={(e) => {
                  setSuccessFeedback('');
                  setError('');
                  setCountryDirector(e.target.checked);
                }}
              />
            </div>
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Deputy Country Director</InputGroupText>
            </InputGroupAddon>
            <div className="intSwitch">
              <CustomInput
                type="switch"
                id="dcdSwitch2"
                name="customSwitch"
                checked={deputyCountryDirector}
                onChange={(e) => {
                  setSuccessFeedback('');
                  setError('');
                  setDeputyCountryDirector(e.target.checked);
                }}
              />
            </div>
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Finance Admin</InputGroupText>
            </InputGroupAddon>
            <div className="intSwitch">
              <CustomInput
                type="switch"
                id="financeAdminSwitch2"
                name="customSwitch"
                checked={financeAdmin}
                onChange={(e) => {
                  setSuccessFeedback('');
                  setError('');
                  setFinanceAdmin(e.target.checked);
                }}
              />
            </div>
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Procurement Admin</InputGroupText>
            </InputGroupAddon>
            <div className="intSwitch">
              <CustomInput
                type="switch"
                id="procurementAdminSwitch2"
                name="customSwitch"
                checked={procurementAdmin}
                onChange={(e) => {
                  setSuccessFeedback('');
                  setError('');
                  setProcurementAdmin(e.target.checked);
                }}
              />
            </div>
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Security Team</InputGroupText>
            </InputGroupAddon>
            <div className="intSwitch">
              <CustomInput
                type="switch"
                id="securityTeamSwitch2"
                name="customSwitch"
                checked={securityTeam}
                onChange={(e) => {
                  setSuccessFeedback('');
                  setError('');
                  setSecurityTeam(e.target.checked);
                }}
              />
            </div>
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Chai Procurement</InputGroupText>
            </InputGroupAddon>
            <div className="intSwitch">
              <CustomInput
                type="switch"
                id="chaiProcurementSwitch2"
                name="customSwitch"
                checked={chaiProcurement}
                onChange={(e) => {
                  setSuccessFeedback('');
                  setError('');
                  setChaiProcurement(e.target.checked);
                }}
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
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setContractType(e.target.value);
              }}
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
              onChange={(date) => {
                setSuccessFeedback('');
                setError('');
                setContractStartDate(date);
              }}
            />
          </InputGroup>
          <FormText>
            To select a single date, double click on that date.
          </FormText>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Contract End Date</InputGroupText>
            </InputGroupAddon>
            <Calendar
              value={contractEndDate}
              onChange={(date) => {
                setSuccessFeedback('');
                setError('');
                setContractEndDate(date);
              }}
            />
          </InputGroup>
          <FormText>
            To select a single date, double click on that date.
          </FormText>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>person&apos;s Supervisor</InputGroupText>
            </InputGroupAddon>
            <div className="selectCustomStyle">
              <Select
                options={allUsers}
                onChange={(opt) => {
                  setSuccessFeedback('');
                  setError('');
                  onSelectSupervisorEmail(opt.value);
                }}
              />
            </div>
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
  token: PropTypes.string,
  roles: PropTypes.object,
  changeSection: PropTypes.func,
  changeActive: PropTypes.func,
  setInitialNotifications: PropTypes.func,
  logUserIn: PropTypes.func,
};

export default connect(mapStateToProps, matchDispatchToProps)(Register);
