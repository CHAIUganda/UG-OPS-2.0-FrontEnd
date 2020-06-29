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
  Label
} from 'reactstrap';
import Calendar from 'react-calendar';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import Select from 'react-select';

import * as sideBarActions from '../../../../redux/actions/sideBarActions';
import CommonSpinner from '../../../common/spinner';
import EditBankDetailsModal from './editBankDetails';
import { BASE_URL, returnStatusClass } from '../../../../config';
import './editUser.css';

const matchDispatchToProps = {
  changeSection: sideBarActions.changeSection,
  changeActive: sideBarActions.changeActive
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
  roles: state.auth.roles
});

function EditUser(props) {
  let user;
  let propsPassed;
  const {
    token,
    changeSection,
    changeActive,
    roles
  } = props;

  if (roles) {
    if (!roles.hr && !roles.admin) {
      return (
        <div className="alert alert-danger text-center" role="alert">
          <p>{'FE: You have no access rights for this resource.'}</p>
        </div>
      );
    }
  } else {
    return (
      <div className="alert alert-danger text-center" role="alert">
        <p>{'FE: You seem to have no roles.'}</p>
        <p>Please contact the system admin to rectify this.</p>
      </div>
    );
  }

  changeSection('Human Resource');
  changeActive(null);

  if (props && props.propsPassed && props.user) {
    user = props.user;
    propsPassed = props.propsPassed;
  } else {
    return (
      <div className="alert alert-info text-center" role="alert">
        <p>Please select a particular user.</p>
      </div>
    );
  }

  const [email, setEmail] = useState(
    user.email
      ? user.email
      : '@clintonhealthaccess.org'
  );
  const [active, setActive] = useState(
    user.active
      ? user.active
      : false
  );
  const [firstName, setFirstName] = useState(
    user.fName
      ? user.fName
      : ''
  );
  const [lastName, setLastName] = useState(
    user.lName
      ? user.lName
      : ''
  );
  const [otherNames, setOtherNames] = useState(
    user.oNames
      ? user.oNames
      : ''
  );
  const [birthDate, setBirthDate] = useState(
    user.birthDate
      ? new Date(user.birthDate)
      : ''
  );
  const [team, setTeam] = useState(
    user.team
      ? user.team
      : ''
  );
  const [contractType, setContractType] = useState(
    user.contractType
      ? user.contractType
      : ''
  );
  const [contractStartDate, setContractStartDate] = useState(
    user.contractStartDate
      ? new Date(user.contractStartDate)
      : ''
  );
  const [contractEndDate, setContractEndDate] = useState(
    user.contractEndDate
      ? new Date(user.contractEndDate)
      : ''
  );
  const [password, setPassword] = useState('123456');
  const [confirmPass, setConfirmPass] = useState('123456');
  const [gender, setGender] = useState(
    user.gender
      ? user.gender
      : ''
  );
  const [position, setPosition] = useState(
    user.title
      ? user.title
      : ''
  );
  const [admin, setAdmin] = useState(
    (user.roles && user.roles.admin)
      ? user.roles.admin
      : false
  );
  const [supervisor, setSupervisor] = useState(
    (user.roles && user.roles.supervisor)
      ? user.roles.supervisor
      : false
  );
  const [humanResource, setHumanResource] = useState(
    (user.roles && user.roles.hr)
      ? user.roles.hr
      : false
  );
  const [staffCategory, setStaffCategory] = useState(
    user.type
      ? user.type
      : ''
  );
  const [programId, setProgramId] = useState(
    user.programId
      ? user.programId
      : ''
  );

  const [countryDirector, setCountryDirector] = useState(
    (user.roles && user.roles.countryDirector)
      ? user.roles.countryDirector
      : false
  );
  const [supervisorsEmail, setSupervisorsEmail] = useState(
    (user.supervisorDetails && user.supervisorDetails.email)
      ? user.supervisorDetails.email
      : ''
  );
  const [nssfNumber, setNssfNumber] = useState(
    user.nssfNumber
      ? user.nssfNumber
      : ''
  );
  const [tinNumber, setTinNumber] = useState(
    user.tinNumber
      ? user.tinNumber
      : ''
  );
  const [workPermitStartDate, setWorkPermitStartDate] = useState(
    user.workPermitStartDate
      ? new Date(user.workPermitStartDate)
      : ''
  );

  const [workPermitEndDate, setWorkPermitEndDate] = useState(
    user.workPermitEndDate
      ? new Date(user.workPermitEndDate)
      : ''
  );
  const [bankAccounts, setBankAccounts] = useState(
    (user.bankAccounts && user.bankAccounts.length > 0)
      ? user.bankAccounts
      : []
  );
  const [allProgrammes, setAllProgrammes] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [error, setError] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [submitSpinner, setSubmitSpinner] = useState(false);
  const [successFeedback, setSuccessFeedback] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [Currency, setCurrency] = useState('UGX');

  const returnDefaultSupervisor = () => {
    if (user.supervisorDetails
        && user.supervisorDetails.fName
        && user.supervisorDetails.lName
        && user.supervisorDetails.email) {
      return {
        label: `${user.supervisorDetails.fName} ${user.supervisorDetails.lName}`,
        value: user.supervisorDetails.email
      };
    }
    return {
      label: 'Not Supplied',
      value: ''
    };
  };

  const [defaultSupervisor, setDefaultSupervisor] = useState(returnDefaultSupervisor());

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

    const editUser = {
      ...user,
      active,
      staffId: user._id,
      fName: firstName,
      lName: lastName,
      birthDate: `${birthDate.getFullYear()}-${birthDate.getMonth() + 1}-${birthDate.getDate()}`,
      bankAccounts,
      contractStartDate: `${contractStartDate.getFullYear()}-${contractStartDate.getMonth() + 1}-${contractStartDate.getDate()}`,
      contractEndDate: `${contractEndDate.getFullYear()}-${contractEndDate.getMonth() + 1}-${contractEndDate.getDate()}`,
      contractType,
      gender,
      admin,
      hr: humanResource,
      supervisor,
      countryDirector,
      title: position,
      programId,
      type: staffCategory,
      team,
      supervisorEmail: supervisorsEmail,
      oNames: otherNames,
      email,
      password,
      contractId: user.contractId,
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
    const apiRoute = `${BASE_URL}auth/editUser`;
    axios.post(apiRoute, editUser)
      . then(() => {
        setSubmitSpinner(false);
        setSuccessFeedback(`${firstName} ${lastName} modified successfully`);
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
        const arrayToSet = res.data.map((arrMapUser) => ({
          label: `${arrMapUser.fName} ${arrMapUser.lName}`,
          value: arrMapUser.email
        }));
        setAllUsers(arrayToSet);
        setDefaultSupervisor(arrayToSet.filter((arr) => arr.value === user.supervisorEmail)[0]);
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
    return 'Edit';
  };

  if (!propsPassed) {
    return (
      <div className="alert alert-info text-center" role="alert">
        <p>Please select a particular user.</p>
      </div>
    );
  }

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
          status: 'ACTIVE',
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
        <h3 className="registerHeading">
          Edit User
        </h3>
        {
          spinner
          && <div className="alert alert-info text-center" role="alert">
            <div><CommonSpinner /></div>
            <p>Getting things ready.....</p>
          </div>
        }
        <div className="alert alert-primary" role="alert">
            Details are saved after submitting.
        </div>
        {error && <div className="errorFeedback"> {error} </div>}
        {successFeedback && <div className="successFeedback"> {successFeedback} </div>}

        <FormGroup>
          <Label for="exampleEmail">
            {
              active
                ? <p>This user account is <span className="btn btn-success">active</span></p>
                : <p>This user account is <span className="btn btn-danger">inactive</span></p>
            }
          </Label>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                {
                  active
                    ? <p>Deactivate account</p>
                    : <p>Activate account</p>
                }
              </InputGroupText>
            </InputGroupAddon>
            <div className="intSwitch">
              <CustomInput
                type="switch"
                id="activeSwitch"
                name="customSwitch"
                checked={active}
                onChange={(e) => {
                  setSuccessFeedback('');
                  setError('');
                  setActive(e.target.checked);
                }}
              />
            </div>
          </InputGroup>
        </FormGroup>

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
              onChange={(date) => {
                setSuccessFeedback('');
                setError('');
                setBirthDate(date);
              }}
            />
          </InputGroup>
        </FormGroup>

        <div className="bankDetailsSection">
          <h5>Bank Details</h5>
          {error && <div className="errorFeedback"> {error} </div>}
          <div className="alert alert-primary" role="alert">
            Note: changes to bank details will be effected when you submit the entire form.
          </div>
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
          <h6>Add a new bank account</h6>
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
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setGender(e.target.value);
              }}
            >
              <option value="">Not set</option>
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
              <option value="">Not set</option>
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
                  value={workPermitStartDate}
                  onChange={(date) => {
                    setSuccessFeedback('');
                    setError('');
                    setWorkPermitStartDate(date);
                  }}
                />
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Work Permit End Date</InputGroupText>
                </InputGroupAddon>
                <Calendar
                  value={workPermitEndDate}
                  onChange={(date) => {
                    setSuccessFeedback('');
                    setError('');
                    setWorkPermitEndDate(date);
                  }}
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
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setTeam(e.target.value);
              }}
            >
              <option value="">Not set</option>
              <option value="Country Office">Country Office</option>
              <option value="Global">Global</option>
            </CustomInput>
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Program</InputGroupText>
            </InputGroupAddon>
            <CustomInput
              type="select"
              id="programmeCustomSelect"
              name="customSelect"
              value={programId}
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setProgramId(e.target.value);
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
              <option value="">Not set</option>
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
                defaultValue={defaultSupervisor}
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

EditUser.propTypes = {
  token: PropTypes.string,
  roles: PropTypes.object,
  propsPassed: PropTypes.bool,
  user: PropTypes.object,
  changeSection: PropTypes.func,
  changeActive: PropTypes.func
};

export default connect(mapStateToProps, matchDispatchToProps)(EditUser);
