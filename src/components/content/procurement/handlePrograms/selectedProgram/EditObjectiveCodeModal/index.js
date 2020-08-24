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
  Input
} from 'reactstrap';
import { FiEdit } from 'react-icons/fi';
import { IconContext } from 'react-icons';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useOktaAuth } from '@okta/okta-react';

import CommonSpinner from '../../../../../common/spinner';

const EditObjectiveCodeModal = ({
  objectiveCodeToEdit,
  editObjectiveCode,
  token,
  BASE_URL,
  index,
  insertNewObjectiveCode,
  newObjectiveCode,
  programId
}) => {
  const [modal, setModal] = useState(false);
  const [objectiveCode, setObjectiveCode] = useState(
    (objectiveCodeToEdit && objectiveCodeToEdit.objectiveCode) ? objectiveCodeToEdit.objectiveCode : ''
  );
  const [status, setStatus] = useState((objectiveCodeToEdit && objectiveCodeToEdit.status) ? objectiveCodeToEdit.status : '');
  const [successMessage, setSuccessMessage] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const [submitSpinner, setSubmitSpinner] = useState(false);

  const { authService } = useOktaAuth();

  const toggle = (event) => {
    event.preventDefault();
    setModal(!modal);
  };

  const handleChange = (event) => {
    event.preventDefault();
    setSuccessMessage('');
    setErrMessage('');

    const { name, value } = event.target;
    if (name === 'objectiveCode') {
      setObjectiveCode(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrMessage('');
    setSuccessMessage('');
    setSubmitSpinner(true);

    if (!status && !newObjectiveCode) {
      setErrMessage('Please set a valid status.');
      setSubmitSpinner(false);
      return;
    }

    const editObjCodeFunc = () => {
      const editObj = {
        id: objectiveCodeToEdit._id,
        objectiveCode,
        programId: objectiveCodeToEdit.programId,
        status
      };

      const endPoint = `${BASE_URL}financeApi/editObjective`;
      axios.defaults.headers.common = { token };
      axios.post(endPoint, editObj)
        .then((res) => {
          setSuccessMessage(res.data.message);
          setSubmitSpinner(false);
          editObjectiveCode(res.data, index);
        })
        .catch((err) => {
          setSubmitSpinner(false);

          if (err && err.response && err.response.status && err.response.status === 401) {
            authService.logout('/');
          }

          if (err && err.response && err.response.data && err.response.data.message) {
            setErrMessage(err.response.data.message);
          } else {
            setErrMessage(err.message);
          }
        });
    };

    const createNewObjCodeFunc = () => {
      const objCodeToCreate = {
        objectiveCode: [objectiveCode],
        programId
      };

      const endPoint = `${BASE_URL}financeApi/createObjective`;
      axios.defaults.headers.common = { token };
      axios.post(endPoint, objCodeToCreate)
        .then((res) => {
          setSuccessMessage(res.data.message);
          setSubmitSpinner(false);
          insertNewObjectiveCode(res.data.objectiveCodes[0]);
        })
        .catch((err) => {
          setSubmitSpinner(false);

          if (err && err.response && err.response.status && err.response.status === 401) {
            authService.logout('/');
          }

          if (err && err.response && err.response.data && err.response.data.message) {
            setErrMessage(err.response.data.message);
          } else {
            setErrMessage(err.message);
          }
        });
    };

    if (newObjectiveCode) {
      createNewObjCodeFunc();
    } else {
      editObjCodeFunc();
    }
  };

  const returnICon = () => {
    if (newObjectiveCode) {
      return (
        <span onClick={toggle} className="pointerCursor">
          <button className="btn btn-outline-primary">Add New</button>
        </span>
      );
    }
    return (
      <span onClick={toggle} className="pointerCursor">
        <IconContext.Provider value={{ size: '2em' }}>
          <FiEdit />
        </IconContext.Provider>
      </span>
    );
  };

  return (
    <div className="inlineItem push-button-left">
      {returnICon()}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          { newObjectiveCode ? 'Create a New Objective Code' : 'Edit Objective Code' }
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            {
              successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )
            }
            {
              errMessage && (
                <div className="alert alert-danger" role="alert">
                  {errMessage}
                </div>
              )
            }
            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Objective Code</InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Objective Code"
                  type="text"
                  name="objectiveCode"
                  value={objectiveCode}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </FormGroup>

            {
              !newObjectiveCode && (
                <FormGroup>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>Status</InputGroupText>
                    </InputGroupAddon>
                    <select className="form-control" value={status} onChange={
                      (e) => {
                        setErrMessage('');
                        setSuccessMessage('');
                        setStatus(e.target.value);
                      }
                    }>
                      <option value="">Not Set</option>
                      <option value="Active">Active</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </InputGroup>
                </FormGroup>
              )
            }

            <div className="mt-5">
              {
                submitSpinner
                  ? (
                    <button className='pointerCursor float-right nextButton'>
                      <CommonSpinner />
                    </button>
                  )
                  : (
                    <button className='pointerCursor float-right nextButton' type='submit'>
                      { newObjectiveCode ? 'Add New Objective code' : 'Edit Objective Code' }
                    </button>
                  )
              }
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle} className="float-left">Close</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

EditObjectiveCodeModal.propTypes = {
  token: PropTypes.string,
  BASE_URL: PropTypes.string,
  index: PropTypes.number,
  objectiveCodeToEdit: PropTypes.object,
  editObjectiveCode: PropTypes.func,
  insertNewObjectiveCode: PropTypes.func,
  newObjectiveCode: PropTypes.bool,
  programId: PropTypes.string
};

export default EditObjectiveCodeModal;
