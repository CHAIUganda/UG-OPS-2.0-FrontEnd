/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
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
  Spinner
} from 'reactstrap';
import { IoMdAdd } from 'react-icons/io';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Cookies from 'js-cookie';

import { BASE_URL } from '../../../../../../config';

const mapStateToProps = (state) => ({
  token: state.auth.token
});

const CreateNewProgramme = ({
  onNewProgramme,
  token,
  allUsers,
  logUserOut
}) => {
  const [modal, setModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState('');
  const [formSpinner, setFormSpinner] = useState(false);
  const [programmeName, setProgrammeName] = useState('');
  const [shortForm, setShortForm] = useState('');
  const [pm, setPm] = useState('');

  const toggle = () => setModal(!modal);

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormSpinner(true);
    setFormError('');
    setFormSuccessMessage('');
    if (!pm) {
      setFormError('Please select a supervisor to continue.');
      return;
    }
    if (!shortForm) {
      setFormError('Please select a short form. A short program name will do.');
      return;
    }
    const endPoint = `${BASE_URL}hrApi/createProgram`;
    const programme = {
      name: programmeName,
      programManagerId: pm,
      shortForm
    };

    axios.defaults.headers.common = { token };
    axios.post(endPoint, programme)
      .then((res) => {
        setFormSpinner(false);
        setProgrammeName('');
        onNewProgramme(res.data);
        setFormSuccessMessage(`${programme.name} Created successfully`);
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

  const handleChange = (event) => {
    event.preventDefault();
    setFormError('');
    setFormSuccessMessage('');
    const { name, value } = event.target;
    if (name === 'programmeName') {
      setProgrammeName(value);
    } else if (name === 'programmeShortForm') {
      setShortForm(value);
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

  const onSelectPm = (value) => {
    setPm(value);
  };

  const returnForm = () => (
    <div className="PublicFormStyle">
      <Form onSubmit={handleSubmit}>
        {formError && <div className="errorFeedback"> {formError} </div>}
        {formSuccessMessage && <div className="successFeedback"> {formSuccessMessage} </div>}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Program Name</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Name of the Program"
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
              <InputGroupText>Program Short Form</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Can be Program name if its short"
              type="text"
              name="programmeShortForm"
              value={shortForm}
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
                onChange={(opt) => onSelectPm(opt.value)}
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

  return (
    <div className="inlineItem">
      <button className="submitButton positionBtn" onClick={toggle}>
        < IoMdAdd />
          Create New Program
      </button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Create a new Program</ModalHeader>
        <ModalBody>
          {returnForm()}
        </ModalBody>
      </Modal>
    </div>
  );
};


CreateNewProgramme.propTypes = {
  token: PropTypes.string,
  allUsers: PropTypes.array,
  logUserOut: PropTypes.func
};

export default connect(mapStateToProps)(CreateNewProgramme);
