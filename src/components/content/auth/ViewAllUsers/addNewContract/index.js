import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  CustomInput,
  Input,
  FormText
} from 'reactstrap';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { IoIosAdd } from 'react-icons/io';
import Calendar from 'react-calendar';
import axios from 'axios';

import { BASE_URL } from '../../../../../config';
import CommonSpinner from '../../../../common/spinner';

const AddNewContOrWP = ({ user }) => {
  const [modal, setModal] = useState(false);
  const [content, setContent] = useState('');
  const [contractType, setContractType] = useState('Full-Time');
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');
  const [contractStartDate, setContractStartDate] = useState();
  const [contractEndDate, setContractEndDate] = useState();
  const [wpStartDate, setWpStartDate] = useState();
  const [wpEndDate, setWpendDate] = useState();
  const [submitSpinner, setSubmitSpinner] = useState(false);

  const toggle = () => setModal(!modal);

  const contractSubmit = () => {
    if (!contractStartDate) {
      setErr('Set a contract start date.');
      return;
    }

    if (!contractEndDate) {
      setErr('Set a contract end date.');
      return;
    }

    const newContract = {
      contractStartDate: `${contractStartDate.getFullYear()}-${contractStartDate.getMonth() + 1}-${contractStartDate.getDate()}`,
      contractEndDate: `${contractEndDate.getFullYear()}-${contractEndDate.getMonth() + 1}-${contractEndDate.getDate()}`,
      contractType,
      staffEmail: user.email
    };
    const url = `${BASE_URL}hrApi/addStaffNewContract`;
    setSubmitSpinner(true);

    axios.post(url, newContract)
      .then((res) => {
        setSubmitSpinner(false);
        setSuccess(res.data.message);
      })
      .catch((e) => {
        if (e && e.response && e.response.data && e.response.data.message) {
          setErr(e.response.data.message);
        } else {
          setErr(e.message);
        }
        setSubmitSpinner(false);
      });
  };

  const workPermitSubmit = () => {
    if (!wpStartDate) {
      setErr('Set a work permit start date.');
      return;
    }

    if (!wpEndDate) {
      setErr('Set a work permit end date.');
      return;
    }

    const newWP = {
      workPermitStartDate: `${wpStartDate.getFullYear()}-${wpStartDate.getMonth() + 1}-${wpStartDate.getDate()}`,
      workPermitEndDate: `${wpEndDate.getFullYear()}-${wpEndDate.getMonth() + 1}-${wpEndDate.getDate()}`,
      staffEmail: user.email
    };
    const url = `${BASE_URL}hrApi/addStaffNewWP`;
    setSubmitSpinner(true);

    axios.post(url, newWP)
      .then((res) => {
        setSubmitSpinner(false);
        setSuccess(res.data.message);
      })
      .catch((e) => {
        if (e && e.response && e.response.data && e.response.data.message) {
          setErr(e.response.data.message);
        } else {
          setErr(e.message);
        }
        setSubmitSpinner(false);
      });
  };

  const handleSubmit = () => {
    if (content === 'Contract') {
      contractSubmit();
      return;
    }
    workPermitSubmit();
  };

  const contractForm = () => {
    return (
      <>
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Staff&apos;s Name</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Assistant Programme Officer"
              type="text"
              value={`${user.fName} ${user.lName}`}
              disabled
            />
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
                setSuccess('');
                setErr('');
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
                setSuccess('');
                setErr('');
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
                setSuccess('');
                setErr('');
                setContractEndDate(date);
              }}
            />
          </InputGroup>
          <FormText>
            To select a single date, double click on that date.
          </FormText>
        </FormGroup>
      </>
    );
  };

  const workPermitForm = () => {
    return (
      <>
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Staff&apos;s Name</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Assistant Programme Officer"
              type="text"
              value={`${user.fName} ${user.lName}`}
              disabled
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Work Permit Start Date</InputGroupText>
            </InputGroupAddon>
            <Calendar
              value={wpStartDate}
              onChange={(date) => {
                setSuccess('');
                setErr('');
                setWpStartDate(date);
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
              value={wpEndDate}
              onChange={(date) => {
                setSuccess('');
                setErr('');
                setWpendDate(date);
              }}
            />
          </InputGroup>
          <FormText>
            To select a single date, double click on that date.
          </FormText>
        </FormGroup>
      </>
    );
  };

  const dropDownSelect = () => {
    return (
      <FormGroup>
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>What are you adding?</InputGroupText>
          </InputGroupAddon>
          <CustomInput
            type="select"
            id="teamCustomSelect"
            name="customSelect"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          >
            <option value="">Not Set</option>
            {
              user.type.toLocaleLowerCase() !== 'national'
              && <option value="Work Permit">Work Permit</option>
            }
            <option value="Contract">Contract</option>
          </CustomInput>
        </InputGroup>
      </FormGroup>
    );
  };

  const mainContent = () => {
    if (content) {
      if (content === 'Work Permit') {
        return (
          <>
            {dropDownSelect()}
            {workPermitForm()}
          </>
        );
      }
      if (content === 'Contract') {
        return (
          <>
            {dropDownSelect()}
            {contractForm()}
          </>
        );
      }
      return (<p>FE: Something went wrong.</p>);
    }
    return dropDownSelect();
  };

  const modelTitle = () => {
    if (content) {
      return (
        <>
          <ModalHeader toggle={toggle}>Add {content}</ModalHeader>
        </>
      );
    }

    return (
      <>
        <ModalHeader toggle={toggle}>Add ____</ModalHeader>
      </>
    );
  };

  const submitButtonText = () => {
    if (submitSpinner) {
      return (
        <CommonSpinner
          variant='White'
        />
      );
    }

    return 'Submit';
  };

  return (
    <div>
      <span onClick={toggle}>
        <IconContext.Provider value={{ size: '2em' }}>
          <IoIosAdd />
        </IconContext.Provider>
      </span>
      <Modal isOpen={modal} toggle={toggle}>
        {modelTitle()}
        <ModalBody>
          {success
            && <div className="alert alert-success" role="alert">
              {success}
            </div>
          }
          {err
            && <div className="alert alert-danger" role="alert">
              {err}
            </div>
          }
          {mainContent()}
          {success
            && <div className="alert alert-success" role="alert">
              {success}
            </div>
          }
          {err
            && <div className="alert alert-danger" role="alert">
              {err}
            </div>
          }
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>{submitButtonText()}</Button>{' '}
          <Button color="secondary" onClick={toggle}>Close</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

AddNewContOrWP.propTypes = {
  user: PropTypes.object
};

export default AddNewContOrWP;
