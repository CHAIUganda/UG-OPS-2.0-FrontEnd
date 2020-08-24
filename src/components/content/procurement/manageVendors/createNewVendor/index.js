import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useOktaAuth } from '@okta/okta-react';
import axios from 'axios';
import {
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  CustomInput,
  Spinner
} from 'reactstrap';

import CommonSpinner from '../../../../common/spinner';
import AddVendorBankingDetails from './addVendorBankingData';

import { BASE_URL } from '../../../../../config';
import * as sideBarActions from '../../../../../redux/actions/sideBarActions';
import * as authActions from '../../../../../redux/actions/authActions';
import * as notificationActions from '../../../../../redux/actions/notificationsActions';

import './createVendor.css';

const mapStateToProps = (state) => ({
  token: state.auth.token,
  roles: state.auth.roles
});

const mapDispatchToProps = {
  changeSection: sideBarActions.changeSection,
  changeActive: sideBarActions.changeActive,
  logUserIn: authActions.logUserIn,
  setInitialNotifications: notificationActions.setInitialNotifications
};

export const CreateANewVendor = ({
  token,
  roles,
  changeSection,
  changeActive,
  setInitialNotifications,
  logUserIn,
  propx
}) => {
  // Check for roles

  if (token && roles) {
    if (!roles.chaiProcurement && !roles.admin) {
      return (
        <div className="alert alert-danger text-center" role="alert">
          <p>{'FE: You have no access rights for this resource.'}</p>
        </div>
      );
    }
  }

  const [spinner, setSpinner] = useState(false);
  const [loadingPageErr, setLoadingPageErr] = useState('');
  const [registeredAddress, setRegisteredAddress] = useState(
    propx
      ? propx.registeredAddress
      : ''
  );
  const [formErr, setFormErr] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [name, setName] = useState(
    propx
      ? propx.name
      : ''
  );
  const [vendorEmail, setVendorEmail] = useState(
    propx
      ? propx.vendorEmail
      : ''
  );
  const [vendorTin, setVendorTin] = useState(
    propx
      ? propx.vendorTin
      : ''
  );
  const [exemptFromWHT, setExemptFromWHT] = useState(
    propx
      ? propx.exemptFromWHT
      : false
  );
  const [onPrequalifiedList, setOnPrequalifiedList] = useState(
    propx
      ? propx.onPrequalifiedList
      : false
  );
  const [bankingDetails, setBankingDetails] = useState(
    propx
      ? propx.bankDetails
      : []
  );
  const [submitSpinner, setSubmitSpinner] = useState(false);

  const { authState, authService } = useOktaAuth();

  changeSection('Procurement');
  changeActive('AddVendor');

  // eslint-disable-next-line no-unused-vars
  const reset = () => {
    setRegisteredAddress('');
    setName('');
    setVendorEmail('');
    setVendorTin('');
    setExemptFromWHT(false);
    setOnPrequalifiedList(false);
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
          position,
          _id,
          supervisorDetails,
          notifications
        } = res.data;
        const genderToSet = res.data.gender;
        const emailToSet = res.data.email;
        const leaveDetailsToSet = res.data.leaveDetails;

        const userObject = {
          ...res.data,
          email: emailToSet,
          token: tokenToSet,
          gender: genderToSet,
          internationalStaff,
          department,
          firstName: fName,
          lastName: lName,
          Position: position,
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
          setLoadingPageErr(err.response.data.message);
        } else {
          setLoadingPageErr(err.message);
        }
      });
  };

  const setUpThisPage = () => {
    // set this page up. Do stuff like pick all users.
    setSpinner(false);

    // const endPoint = `${BASE_URL}hrApi/getProgramsklkl`;
    // axios.defaults.headers.common = { token };
    // axios.get(endPoint)
    //   .then((res) => {
    //     setAllPrograms(res.data);
    //     setSpinner(false);
    //   })
    //   .catch((err) => {
    //     setSpinner(false);

    //     if (err && err.response && err.response.status && err.response.status === 401) {
    //       authService.logout('/');
    //     }

    //     if (err && err.response && err.response.data && err.response.data.message) {
    //       setLoadingPageErr(err.response.data.message);
    //     } else {
    //       setLoadingPageErr(err.message);
    //     }
    //   });
  };

  useEffect(() => {
    setSpinner(true);
    setLoadingPageErr('');

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

  if (loadingPageErr) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        <p>{loadingPageErr}</p>
      </div>
    );
  }

  if (spinner) {
    return (
      <div className="alert alert-info text-center" role="alert">
        <div>
          <CommonSpinner />
          <p>Getting things ready.....</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitSpinner(true);
    setFormErr('');
    setSuccessMessage('');

    if (bankingDetails.length < 1) {
      setFormErr('Add banking details.');
      setSubmitSpinner(false);
      return;
    }

    const addNewVendorFunc = () => {
      const vendorToAdd = {
        name,
        vendorTin,
        vendorEmail,
        onPrequalifiedList,
        exemptFromWHT,
        registeredAddress,
        bankDetails: bankingDetails
      };
      axios.defaults.headers.common = { token };
      const apiRoute = `${BASE_URL}procurementApi/registerVendor`;
      axios.post(apiRoute, vendorToAdd)
        . then((res) => {
          setSuccessMessage(res.data.message);
          setSubmitSpinner(false);
        })
        .catch((err) => {
          setSubmitSpinner(false);

          if (err && err.response && err.response.status && err.response.status === 401) {
            authService.logout('/');
          }

          if (err && err.response && err.response.data && err.response.data.message) {
            setFormErr(err.response.data.message);
          } else {
            setFormErr(err.message);
          }
        });
    };

    const editVendorFunc = () => {
      const vendorToEdit = {
        vendorId: propx._id,
        name,
        vendorTin,
        vendorEmail,
        onPrequalifiedList,
        exemptFromWHT,
        registeredAddress,
        bankDetails: bankingDetails
      };
      axios.defaults.headers.common = { token };
      const apiRoute = `${BASE_URL}procurementApi/editVendor`;
      axios.post(apiRoute, vendorToEdit)
        . then((res) => {
          setSuccessMessage(res.data.message);
          setSubmitSpinner(false);
        })
        .catch((err) => {
          setSubmitSpinner(false);

          if (err && err.response && err.response.status && err.response.status === 401) {
            authService.logout('/');
          }

          if (err && err.response && err.response.data && err.response.data.message) {
            setFormErr(err.response.data.message);
          } else {
            setFormErr(err.message);
          }
        });
    };

    if (propx) {
      editVendorFunc();
    } else {
      addNewVendorFunc();
    }
  };

  const addBankingData = (newData) => {
    const arr = [...bankingDetails];
    arr.push(newData);
    setBankingDetails(arr);
    setFormErr('');
    setSuccessMessage('');
  };

  const modifyBankingData = (modifiedData, index) => {
    const arr = [...bankingDetails];
    arr.splice(index, 1, modifiedData);
    setBankingDetails(arr);
    setFormErr('');
    setSuccessMessage('');
  };

  const returnBankingDetailsTable = () => {
    if (bankingDetails.length < 1) {
      return (
        <div className="alert alert-info m-3" role="alert">
           No vendor banking details added yet.
        </div>
      );
    }

    return (
      <table className="table holidaysTable">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Bank Name</th>
            <th scope="col">Account Name</th>
            <th scope="col">Account Number</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {
            bankingDetails.map((b, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{b.bankName}</td>
                <td>{b.accountName}</td>
                <td>{b.accountNumber}</td>
                <td>
                  <AddVendorBankingDetails
                    modifyBankingData={modifyBankingData}
                    edit={true}
                    bankingData={b}
                  />
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h2>
        {
          propx
            ? 'Edit Vendor'
            : 'Add A Vendor.'
        }
      </h2>
      <form className="createVendorForm" onSubmit={handleSubmit}>
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
              <InputGroupText>Vendor Name</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="This is the vendor's name"
              type="text"
              value={name}
              onChange={(e) => {
                setSuccessMessage('');
                setFormErr('');
                setName(e.target.value);
              }}
              required
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Vendor&apos;s email</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="This is the vendor's email address"
              type="text"
              value={vendorEmail}
              onChange={(e) => {
                setSuccessMessage('');
                setFormErr('');
                setVendorEmail(e.target.value);
              }}
              required
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Registered Address</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="This is the vendor's registered address"
              type="text"
              value={registeredAddress}
              onChange={(e) => {
                setSuccessMessage('');
                setFormErr('');
                setRegisteredAddress(e.target.value);
              }}
              required
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Vendor&apos;s TIN number</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="This is the vendor's tin number"
              type="text"
              value={vendorTin}
              onChange={(e) => {
                setSuccessMessage('');
                setFormErr('');
                setVendorTin(e.target.value);
              }}
              required
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Exempt From Withholding Tax</InputGroupText>
            </InputGroupAddon>
            <div className="intSwitch">
              <CustomInput
                type="switch"
                id="exemptFromWHTSwitch"
                name="customSwitch"
                checked={exemptFromWHT}
                onChange={(e) => {
                  setSuccessMessage('');
                  setFormErr('');
                  setExemptFromWHT(e.target.checked);
                }}
              />
            </div>
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>On Prequalified List</InputGroupText>
            </InputGroupAddon>
            <div className="intSwitch">
              <CustomInput
                type="switch"
                id="onPrequalifiedListSwitch"
                name="customSwitch"
                checked={onPrequalifiedList}
                onChange={(e) => {
                  setSuccessMessage('');
                  setFormErr('');
                  setOnPrequalifiedList(e.target.checked);
                }}
              />
            </div>
          </InputGroup>
        </FormGroup>

        <div className="mt-5 mb-2">
          <h5 className="inlineItem mr-5">Vendor&apos;s Banking Details</h5>
          <AddVendorBankingDetails
            addBankingData={addBankingData}
            edit={false}
          />
          {returnBankingDetailsTable()}
        </div>

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
            ? <button className="btn btn-outline-primary m-2"><Spinner /></button>
            : <button type="submit" className="btn btn-outline-primary m-2">
              {
                propx
                  ? 'Edit vendor'
                  : 'Add Vendor'
              }
            </button>
        }

      </form>
    </div>
  );
};

CreateANewVendor.propTypes = {
  token: PropTypes.string,
  roles: PropTypes.object,
  changeSection: PropTypes.func,
  changeActive: PropTypes.func,
  setInitialNotifications: PropTypes.func,
  logUserIn: PropTypes.func,
  propx: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateANewVendor);
