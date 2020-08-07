import React, { useState } from 'react';
import {
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormText,
} from 'reactstrap';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { IoIosArrowForward } from 'react-icons/io';

import Icon from '../../../../../common/icon';

const InitialDetailsComp = ({
  allUsers,
  initialProDetails,
  setInitialProDetails,
  setCurrentComponent
}) => {
  const [programName, setProgramName] = useState((initialProDetails && initialProDetails.name) ? initialProDetails.name : '');
  const [shortForm, setShortForm] = useState((initialProDetails && initialProDetails.shortForm) ? initialProDetails.shortForm : '');
  const [formError, setFormError] = useState('');
  const [programManagerId, setProgramManagerId] = useState((initialProDetails && initialProDetails.programManagerId) ? initialProDetails.programManagerId : '');
  const [operationsLeadId, setOperationsLeadId] = useState((initialProDetails && initialProDetails.operationsLeadId) ? initialProDetails.operationsLeadId : '');

  const handlesubmit = (event) => {
    event.preventDefault();

    if (!programManagerId) {
      setFormError('Please select a Program Manager.');
      return;
    }

    if (!operationsLeadId) {
      setFormError('Please select an Operations Lead.');
      return;
    }

    const initialDetailsObj = {
      name: programName,
      programManagerId,
      operationsLeadId,
      shortForm
    };
    setInitialProDetails(initialDetailsObj);
    setCurrentComponent(1);
  };

  const handleChange = (event) => {
    event.preventDefault();
    setFormError('');

    const { name, value } = event.target;
    if (name === 'name') {
      setProgramName(value);
    } else if (name === 'shortForm') {
      setShortForm(value);
    }
  };

  return (
    <div className="mt-2 innerPageProg">
      <h4>Initial program details</h4>
      <form onSubmit={handlesubmit}>
        {
          formError && <div className="alert alert-danger" role="alert">
            {formError}
          </div>
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
            <div className="selectCustomStyle">
              <Select
                options={allUsers}
                onChange={(opt) => {
                  setFormError('');
                  setProgramManagerId(opt.value);
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
            <div className="selectCustomStyle">
              <Select
                options={allUsers}
                onChange={(opt) => {
                  setFormError('');
                  setOperationsLeadId(opt.value);
                }}
              />
            </div>
          </InputGroup>
        </FormGroup>

        <div className="mt-5">
          <button className='pointerCursor float-right nextButton'>
            Next
            <Icon
              Icon2Render={IoIosArrowForward}
              color={'#003366'}
            />
          </button>
        </div>
      </form>
    </div>
  );
};

InitialDetailsComp.propTypes = {
  allUsers: PropTypes.array,
  initialProDetails: PropTypes.object,
  setInitialProDetails: PropTypes.func,
  setCurrentComponent: PropTypes.func
};

export default InitialDetailsComp;
