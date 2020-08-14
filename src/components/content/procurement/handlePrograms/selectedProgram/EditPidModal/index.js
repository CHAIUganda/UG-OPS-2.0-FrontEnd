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

const EditPidModal = ({
  pidToEdit,
  editPid,
  token,
  BASE_URL,
  index
}) => {
  const [modal, setModal] = useState(false);
  const [pid, setPid] = useState(
    (pidToEdit && pidToEdit.pId) ? pidToEdit.pId : ''
  );
  const [status, setStatus] = useState((pidToEdit && pidToEdit.status) ? pidToEdit.status : '');
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
    if (name === 'pid') {
      setPid(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrMessage('');
    setSuccessMessage('');
    setSubmitSpinner(true);

    if (!status) {
      setErrMessage('Please set a valid status.');
      setSubmitSpinner(false);
      return;
    }

    const editObj = {
      id: pidToEdit._id,
      pId: pid,
      programId: pidToEdit.programId,
      status
    };

    const endPoint = `${BASE_URL}financeApi/editProject`;
    axios.defaults.headers.common = { token };
    axios.post(endPoint, editObj)
      .then((res) => {
        setSuccessMessage(res.data.message);
        setSubmitSpinner(false);
        editPid(res.data, index);
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

  const returnICon = () => {
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
          Edit PID
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
                  <InputGroupText>PID</InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="PID"
                  type="text"
                  name="pid"
                  value={pid}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </FormGroup>

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
                      Edit PID
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

EditPidModal.propTypes = {
  pidToEdit: PropTypes.object,
  editPid: PropTypes.func,
  token: PropTypes.string,
  BASE_URL: PropTypes.string,
  index: PropTypes.number
};

export default EditPidModal;
