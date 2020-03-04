/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React, { useState, useEffect } from 'react';
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
  // CustomInput
} from 'reactstrap';
import { IoMdAdd } from 'react-icons/io';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Select from 'react-select';

import CommonSpinner from '../../../../../common/spinner';
import { BASE_URL } from '../../../../../../config';

const mapStateToProps = (state) => ({
  token: state.auth.token
});

const CreateNewProgramme = ({ onNewProgramme, token }) => {
  const [modal, setModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState('');
  const [formSpinner, setFormSpinner] = useState(false);
  const [programmeName, setProgrammeName] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [loadUsersSpinner, setLoadUsersSpinner] = useState(false);
  // const [pm, setPm] = useState('none');

  const toggle = () => setModal(!modal);

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormSpinner(true);
    setFormError('');
    setFormSuccessMessage('');
    const endPoint = `${BASE_URL}hrApi/createProgram`;
    const programme = {
      name: programmeName,
      programManagerEmail: 'a@a.com'
    };

    axios.defaults.headers.common = { token };
    axios.post(endPoint, programme)
      .then((res) => {
        setFormSpinner(false);
        setProgrammeName('');
        onNewProgramme(res.data.programtoSave);
        setFormSuccessMessage(`${programme.name} Created successfully`);
      })
      .catch((err) => {
        setFormSpinner(false);
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
    setFormSuccessMessage('');
    const { name, value } = event.target;
    if (name === 'programmeName') {
      setProgrammeName(value);
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
              <InputGroupText>Programme Name</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Name of the Programme"
              type="text"
              name="programmeName"
              value={programmeName}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Select P.M</InputGroupText>
            </InputGroupAddon>
            <div className="selectCustomStyle">
              <Select
                options={allUsers}
              />
            </div>
          </InputGroup>
        </FormGroup>
        <button className="submitButton" type="submit">
          {buttonText()}
        </button>
        <Button color="secondary" onClick={toggle} className="float-right">Cancel</Button>
      </Form>
    </div>
  );

  useEffect(() => {
    setLoadUsersSpinner(true);
    axios.defaults.headers.common = { token };
    const endPoint = `${BASE_URL}auth/getUsers`;

    axios.get(endPoint)
      .then((res) => {
        setLoadUsersSpinner(false);
        const arrayToSet = res.data.map((user) => ({
          label: `${user.fName} ${user.lName}`,
          value: user.email
        }));
        setAllUsers(arrayToSet);
      })
      .catch((err) => {
        setLoadUsersSpinner(false);
        if (err && err.response && err.response.data && err.response.data.message) {
          setFormError(err.response.data.message);
        } else {
          setFormError(err.message);
        }
      });
  }, []);

  if (loadUsersSpinner) {
    return (
      <div className="alert alert-info text-center" role="alert">
        <div><CommonSpinner /></div>
        <p>Getting things ready.....</p>
      </div>
    );
  }
  return (
    <div className="inlineItem">
      <button className="submitButton positionBtn" onClick={toggle}>
        < IoMdAdd />
          Create New Programme
      </button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Create a new Programme</ModalHeader>
        <ModalBody>
          {returnForm()}
        </ModalBody>
      </Modal>
    </div>
  );
};


CreateNewProgramme.propTypes = {
  token: PropTypes.string,
  logUserIn: PropTypes.func
};

export default connect(mapStateToProps)(CreateNewProgramme);
