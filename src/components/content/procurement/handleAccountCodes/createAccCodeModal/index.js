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
  FormText,
  CustomInput
} from 'reactstrap';
import { IoMdAdd } from 'react-icons/io';
import { FiEdit } from 'react-icons/fi';
import { IconContext } from 'react-icons';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import { BASE_URL } from '../../../../../config';
import * as authActions from '../../../../../redux/actions/authActions';

const mapStateToProps = (state) => ({
  token: state.auth.token
});

const matchDispatchToProps = {
  logUserOut: authActions.logUserOut
};

const CreateNewAccountCode = ({
  updateAccCodessArray, // on add
  editArrayOfAccs, // on edit
  token,
  edit,
  accCode,
  logUserOut
}) => {
  const [modal, setModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState('');
  const [formSpinner, setFormSpinner] = useState(false);

  const [accountCode, setAccountCode] = useState(
    edit ? accCode.accountCode : ''
  );

  const [financialGrouping, setFinancialGrouping] = useState(
    edit ? accCode.financialGrouping : ''
  );

  const [useDescription, setUseDescription] = useState(
    edit ? accCode.useDecsription : ''
  );

  const [costedWorkPlans, setCostedWorkPlans] = useState(
    edit ? accCode.includeOn.costedWorkPlans : false
  );

  const [quickBooks, setQuickBooks] = useState(
    edit ? accCode.includeOn.quickBooks : false
  );

  const [usedInCountry, setUsedInCountry] = useState(
    edit ? accCode.usedInCountry : false
  );

  const [description, setDesricption] = useState(
    edit ? accCode.description : ''
  );

  const [status, setStatus] = useState(
    edit ? accCode.status : ''
  );

  const toggle = () => setModal(!modal);

  const reset = () => {
    setAccountCode('');
    setFinancialGrouping('');
    setUseDescription('');
    setCostedWorkPlans(false);
    setQuickBooks(false);
    setUsedInCountry(false);
    setDesricption('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormSpinner(true);
    setFormError('');
    setFormSuccessMessage('');

    if (!accountCode) {
      setFormError('Please enter an account code.');
      return;
    }

    if (!financialGrouping) {
      setFormError('Please enter a financial grouping.');
      return;
    }

    if (!useDescription) {
      setFormError('Please enter a short description under use Description.');
      return;
    }

    if (!description) {
      setFormError('Please enter a detailed description. ');
      return;
    }

    const accountCodeToHandle = {
      accountCode,
      financialGrouping,
      useDecsription: useDescription,
      costedWorkPlans,
      quickBooks,
      description,
      usedInCountry
    };

    const addNewAccCode = () => {
      const endPoint = `${BASE_URL}financeApi/createAccount`;
      axios.defaults.headers.common = { token };
      axios.post(endPoint, accountCodeToHandle)
        .then((res) => {
          setFormSpinner(false);
          // reset values
          reset();
          updateAccCodessArray(res.data);
          setFormSuccessMessage(`${accountCodeToHandle.accountCode} Created successfully`);
        })
        .catch((err) => {
          setFormSpinner(false);

          if (err && err.response && err.response.status && err.response.status === 401) {
            Cookies.remove('token');
            logUserOut();
          }

          if (err && err.response && err.response.data && err.response.data.message) {
            setFormError(err.response.data.message);
          } else {
            setFormError(err.message);
          }
        });
    };

    const EditAccCode = () => {
      if (!status) {
        setFormError('Please set a status');
        setFormSpinner(false);
        return;
      }
      const accountCodeEdit = {
        ...accCode,
        accountCode,
        financialGrouping,
        useDecsription: useDescription,
        costedWorkPlans,
        quickBooks,
        description,
        usedInCountry,
        status,
        id: accCode._id
      };

      const endPoint = `${BASE_URL}financeApi/editAccount`;
      axios.defaults.headers.common = { token };
      axios.post(endPoint, accountCodeEdit)
        .then((res) => {
          setFormSpinner(false);
          editArrayOfAccs(res.data);
          setFormSuccessMessage(res.data.message);
        })
        .catch((err) => {
          setFormSpinner(false);

          if (err && err.response && err.response.status && err.response.status === 401) {
            Cookies.remove('token');
            logUserOut();
          }

          if (err && err.response && err.response.data && err.response.data.message) {
            setFormError(err.response.data.message);
          } else {
            setFormError(err.message);
          }
        });
    };

    if (edit) {
      EditAccCode();
    } else {
      addNewAccCode();
    }
  };

  const handleChange = (event) => {
    event.preventDefault();
    setFormError('');
    setFormSuccessMessage('');
    const { name, value } = event.target;
    if (name === 'accountCode') {
      setAccountCode(value);
    } else if (name === 'financialGrouping') {
      setFinancialGrouping(value);
    } else if (name === 'useDescription') {
      setUseDescription(value);
    } else if (name === 'detailedDescription') {
      setDesricption(value);
    }
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
              <InputGroupText>Account Code</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="The account code to create"
              type="text"
              name="accountCode"
              value={accountCode}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Financial Grouping</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Financial Grouping"
              type="text"
              name="financialGrouping"
              value={financialGrouping}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <FormText color="muted">
            E.g Office Expenses
          </FormText>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Use Decsription</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Short description"
              type="text"
              name="useDescription"
              value={useDescription}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <FormText color="muted">
            This is a short description E.g VAT and Other Sales Taxes
          </FormText>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Detailed Decsription</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Detailed description"
              type="text"
              name="detailedDescription"
              value={description}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <FormText color="muted">
            This is a Detailed description
          </FormText>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>To be included on the costed work plan</InputGroupText>
            </InputGroupAddon>
            <div className="intSwitch">
              <CustomInput
                type="switch"
                id="cwpSwitch2"
                name="cwpSwitch"
                checked={costedWorkPlans}
                onChange={(e) => {
                  setFormError('');
                  setFormSuccessMessage('');
                  setCostedWorkPlans(e.target.checked);
                }}
              />
            </div>
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>To be included on quickbooks</InputGroupText>
            </InputGroupAddon>
            <div className="intSwitch">
              <CustomInput
                type="switch"
                id="qbSwitch2"
                name="qbSwitch"
                checked={quickBooks}
                onChange={(e) => {
                  setFormError('');
                  setFormSuccessMessage('');
                  setQuickBooks(e.target.checked);
                }}
              />
            </div>
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>To be used in country</InputGroupText>
            </InputGroupAddon>
            <div className="intSwitch">
              <CustomInput
                type="switch"
                id="icSwitch2"
                name="icSwitch"
                checked={usedInCountry}
                onChange={(e) => {
                  setFormError('');
                  setFormSuccessMessage('');
                  setUsedInCountry(e.target.checked);
                }}
              />
            </div>
          </InputGroup>
        </FormGroup>

        {
          edit && <FormGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>Status</InputGroupText>
              </InputGroupAddon>
              <select className="form-control" value={status} onChange={
                (e) => {
                  setFormError('');
                  setFormSuccessMessage('');
                  setStatus(e.target.value);
                }
              }>
                <option value="">Not Set</option>
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
              </select>
            </InputGroup>
          </FormGroup>
        }

        <button className="submitButton" type="submit">
          {buttonText()}
        </button>
        <Button color="secondary" onClick={toggle} className="float-right">Cancel</Button>
      </Form>
    </div>
  );

  const icon = () => {
    if (edit) {
      return (
        <span onClick={toggle}>
          <IconContext.Provider value={{ size: '2em' }}>
            <FiEdit />
          </IconContext.Provider>
        </span>
      );
    }

    return (<button className="submitButton positionBtn" onClick={toggle}>
      < IoMdAdd />
   New Account Code
    </button>);
  };

  return (
    <div className="inlineItem">
      {/* <button className="submitButton positionBtn" onClick={toggle}>
        < IoMdAdd />
           New Account Code
      </button> */}
      {icon()}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {
            edit
              ? 'Edit Account Code'
              : 'Create New Account Code'
          }
        </ModalHeader>
        <ModalBody>
          {returnForm()}
        </ModalBody>
      </Modal>
    </div>
  );
};


CreateNewAccountCode.propTypes = {
  token: PropTypes.string,
  updateAccCodessArray: PropTypes.func,
  edit: PropTypes.bool,
  accCode: PropTypes.object,
  editArrayOfAccs: PropTypes.func,
  logUserOut: PropTypes.func
};

export default connect(mapStateToProps, matchDispatchToProps)(CreateNewAccountCode);
