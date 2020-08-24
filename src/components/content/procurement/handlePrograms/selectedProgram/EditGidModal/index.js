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

const EditGidModal = ({
  gidToEdit,
  editGid,
  token,
  BASE_URL,
  index,
  newGid,
  programId,
  insertNewGid
}) => {
  const [modal, setModal] = useState(false);
  const [gid, setGid] = useState(
    (gidToEdit && gidToEdit.gId) ? gidToEdit.gId : ''
  );
  const [status, setStatus] = useState((gidToEdit && gidToEdit.status) ? gidToEdit.status : '');
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
    if (name === 'gid') {
      setGid(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrMessage('');
    setSuccessMessage('');
    setSubmitSpinner(true);

    if (!status && !newGid) {
      setErrMessage('Please set a valid status.');
      setSubmitSpinner(false);
      return;
    }

    const editGidFunc = () => {
      const editObj = {
        id: gidToEdit._id,
        gId: gid,
        programId: gidToEdit.programId,
        status
      };

      const endPoint = `${BASE_URL}financeApi/editGrant`;
      axios.defaults.headers.common = { token };
      axios.post(endPoint, editObj)
        .then((res) => {
          setSuccessMessage(res.data.message);
          setSubmitSpinner(false);
          editGid(res.data, index);
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

    const createNewGid = () => {
      const gitToCreate = {
        gId: [gid],
        programId
      };

      const endPoint = `${BASE_URL}financeApi/createGrant`;
      axios.defaults.headers.common = { token };
      axios.post(endPoint, gitToCreate)
        .then((res) => {
          setSuccessMessage(res.data.message);
          setSubmitSpinner(false);
          insertNewGid(res.data.gIds[0]);
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

    if (newGid) {
      createNewGid();
    } else {
      editGidFunc();
    }
  };

  const returnICon = () => {
    if (newGid) {
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
          { newGid ? 'Create a New GID' : 'Edit GID' }
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
                  <InputGroupText>GID</InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="GID"
                  type="text"
                  name="gid"
                  value={gid}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </FormGroup>

            {
              !newGid && (
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
                      { newGid ? 'Add New Gid' : 'Edit GID' }
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

EditGidModal.propTypes = {
  gidToEdit: PropTypes.object,
  editGid: PropTypes.func,
  token: PropTypes.string,
  BASE_URL: PropTypes.string,
  index: PropTypes.number,
  newGid: PropTypes.bool,
  programId: PropTypes.string,
  insertNewGid: PropTypes.func
};

export default EditGidModal;
