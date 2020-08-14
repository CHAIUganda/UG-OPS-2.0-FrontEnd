import React, { useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { IconContext } from 'react-icons';
import PropTypes from 'prop-types';
import axios from 'axios';
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
  FormText,
} from 'reactstrap';
import Select from 'react-select';
import { useOktaAuth } from '@okta/okta-react';

import CommonSpinner from '../../../../../common/spinner';
import { BASE_URL } from '../../../../../../config';

const EditGeneralDetails = ({
  progName,
  sForm,
  allUsers,
  pm,
  opsLead,
  id,
  token
}) => {
  const [modal, setModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [programName, setProgramName] = useState(progName);
  const [shortForm, setShortForm] = useState(sForm);
  const [programManager, setProgramManager] = useState(pm);
  const [operationsLead, setOperationsLead] = useState(opsLead);
  const [submitSpinner, setSubmitSpinner] = useState(false);

  const { authService } = useOktaAuth();

  const toggle = (event) => {
    event.preventDefault();
    setModal(!modal);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError('');
    setSuccessMessage('');
    setSubmitSpinner(true);

    const progToEdit = {
      id,
      name: programName,
      programManagerId: programManager.value,
      operationsLeadId: operationsLead.value,
      shortForm
    };

    const endPoint = `${BASE_URL}hrApi/editProgram`;
    axios.defaults.headers.common = { token };
    axios.post(endPoint, progToEdit)
      .then((res) => {
        setSuccessMessage(res.data.message);
        setSubmitSpinner(false);
      })
      .catch((err) => {
        setSubmitSpinner(false);

        if (err && err.response && err.response.status && err.response.status === 401) {
          authService.logout('/');
        }

        if (err && err.response && err.response.data && err.response.data.message) {
          setFormError(err.response.data.message);
        } else {
          setFormError(err.message);
        }
      });
  };

  const handleChange = (event) => {
    event.preventDefault();
    setFormError('');
    setSuccessMessage('');

    const { name, value } = event.target;
    if (name === 'name') {
      setProgramName(value);
    } else if (name === 'shortForm') {
      setShortForm(value);
    }
  };

  const returnICon = () => {
    return (
      <span onClick={toggle} className="pointerCursor">
        <IconContext.Provider value={{ size: '2em' }}>
          <FiEdit />
        </IconContext.Provider>
        Edit General Details
      </span>
    );
  };

  return (
    <div>
      {returnICon()}
      <Modal isOpen={modal} toggle={toggle} className="editGenDetails">
        <ModalHeader toggle={toggle}>Edit General Details</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            {
              formError && <div className="alert alert-danger" role="alert">
                {formError}
              </div>
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
                  <InputGroupText>Name of Program</InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="This is the full name of the program"
                  type="text"
                  name="name"
                  value={programName}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
              <FormText color="muted">
            This is the full name of the program
              </FormText>
            </FormGroup>

            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Short Form</InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="This is the short form of the program full name"
                  type="text"
                  name="shortForm"
                  value={shortForm}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
              <FormText color="muted">
            This is the short form of the program full name e.g ops for operations
              </FormText>
            </FormGroup>

            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Program Manager</InputGroupText>
                </InputGroupAddon>
                <div className="selectCustomStyleGenDetails">
                  <Select
                    options={allUsers}
                    value={programManager}
                    onChange={(opt) => {
                      setFormError('');
                      setProgramManager(opt);
                    }}
                  />
                </div>
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Operations Lead</InputGroupText>
                </InputGroupAddon>
                <div className="selectCustomStyleGenDetails">
                  <Select
                    options={allUsers}
                    value={operationsLead}
                    onChange={(opt) => {
                      setFormError('');
                      setOperationsLead(opt);
                    }}
                  />
                </div>
              </InputGroup>
            </FormGroup>
            {
              submitSpinner
                ? (
                  <button className="submitButton">
                    <CommonSpinner />
                  </button>
                )
                : <button className="submitButton" type="submit">Submit</button>
            }
          </form>
        </ModalBody>
        <ModalFooter>
          {' '}
          <span color="secondary" onClick={toggle}>Cancel</span>
        </ModalFooter>
      </Modal>
    </div>
  );
};

EditGeneralDetails.propTypes = {
  token: PropTypes.string,
  progName: PropTypes.string,
  sForm: PropTypes.string,
  allUsers: PropTypes.array,
  pm: PropTypes.string,
  opsLead: PropTypes.string,
  id: PropTypes.string
};

export default EditGeneralDetails;
