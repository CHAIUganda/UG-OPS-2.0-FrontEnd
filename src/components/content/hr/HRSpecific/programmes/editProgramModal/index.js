import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import { FiEdit } from 'react-icons/fi';
import { IconContext } from 'react-icons';
import PropTypes from 'prop-types';
import axios from 'axios';
import Select from 'react-select';

import { BASE_URL } from '../../../../../../config';
import CommonSpinner from '../../../../../common/spinner';

export default function EditProgram({
  program,
  progIndex,
  manageProgs,
  token,
  allUsers
}) {
  const [modal, setModal] = useState(false);
  const [submitSpinner, setSubmitSpinner] = useState(false);
  const [error, setError] = useState('');
  const [successFeedback, setSuccessFeedback] = useState('');
  const [RebuildArray, setRebuildArray] = useState(false);
  const [pm, setPm] = useState(program.programManagerId);
  const [programmeName, setProgrammeName] = useState(program.name);
  const [shortForm, setShortForm] = useState(program.shortForm);

  const toggle = () => {
    const bool = !modal;
    if (!bool && RebuildArray) {
      const rebuildObject = {
        ...program
      };
      manageProgs(progIndex, rebuildObject);
      setModal(bool);
      return;
    }
    setModal(bool);
  };

  const handleSubmitChanges = (event) => {
    event.preventDefault();
    setSubmitSpinner(true);
    setError('');
    setSuccessFeedback('');
    if (!pm) {
      setError('Please select a supervisor to continue.');
      return;
    }
    if (!shortForm) {
      setError('Please select a short form. A short program name will do.');
      return;
    }
    const endPoint = `${BASE_URL}hrApi/createProgram123`;
    const programme = {
      name: programmeName,
      programManagerId: pm,
      shortForm
    };

    axios.defaults.headers.common = { token };
    axios.post(endPoint, programme)
      .then(() => {
        setSubmitSpinner(false);
        setProgrammeName('');
        setRebuildArray(true);
        setSuccessFeedback(`${programme.name} modified successfully`);
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

  const submitNewChangesTxt = () => {
    if (submitSpinner) {
      return (
        <div>
          <p>Please wait ... </p>
          <CommonSpinner />
        </div>
      );
    }

    return 'Submit New Changes';
  };

  const handleChange = (event) => {
    event.preventDefault();
    setError('');
    setSuccessFeedback('');
    const { name, value } = event.target;
    if (name === 'programmeName') {
      setProgrammeName(value);
    } else if (name === 'programmeShortForm') {
      setShortForm(value);
    }
  };

  const onSelectPm = (value) => {
    setPm(value);
  };

  const returnForm = () => (
    <div className="PublicFormStyle">
      <Form onSubmit={submitNewChangesTxt}>
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
              <InputGroupText>Programme Short Form</InputGroupText>
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
        <button className="submitButton" onClick={handleSubmitChanges}>{submitNewChangesTxt()}</button>
        <Button color="secondary" onClick={toggle} className="float-right">Cancel</Button>
      </Form>
    </div>
  );

  return (
    <div>
      <span
        onClick={toggle}
        className="pointerCursor">
        <IconContext.Provider value={{ size: '2em' }}>
          <FiEdit />
        </IconContext.Provider>
      </span>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Edit Program</ModalHeader>
        <ModalBody>
          {
            error
            && <div className="errorFeedback row">
              <div className="col">
                {error}
              </div>
            </div>
          }
          {
            successFeedback
            && <div className="successFeedback row">
              <div className="col">
                {successFeedback}
              </div>
            </div>
          }
          <div className="row">
            <div className="col">
              {returnForm()}
            </div>
          </div>

          <ModalFooter>
            <Button color="secondary" onClick={toggle} className="float-right">Close</Button>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}


EditProgram.propTypes = {
  program: PropTypes.object,
  progIndex: PropTypes.number,
  manageProgs: PropTypes.func,
  token: PropTypes.string,
  allUsers: PropTypes.array
};
