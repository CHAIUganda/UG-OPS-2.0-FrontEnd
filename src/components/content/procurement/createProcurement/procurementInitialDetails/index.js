import React, { useState } from 'react';
import {
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormFeedback,
  CustomInput,
  FormText
} from 'reactstrap';
import PropTypes from 'prop-types';

import NextButton from '../../../../common/nextButton';
// import BackButton from '../../../../common/backButton';

function ProcurementInitialDetails({
  setSuccessFeedback,
  setError,
  setGid,
  gid,
  pid,
  setPid,
  objectiveCode,
  setObjectiveCode,
  setCurrentComponent,
  activeSections,
  currentComponent
}) {
  const [gidError, setGidError] = useState('');
  const [pidEror, setPidError] = useState('');
  const [objectiveCodeError, setObjectiveCodeError] = useState('');

  const errorProps = () => {
    const arr = [];
    if (!gid) {
      arr.push({
        err: 'Please set a GID to continue.',
        setter: setGidError
      });
    }

    if (!pid) {
      arr.push({
        err: 'Please set a PID to continue.',
        setter: setPidError
      });
    }
    return arr;
  };

  const returnGidInput = () => {
    if (gidError) {
      return (
        <>
          {/*  GID */}
          <FormGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>GID</InputGroupText>
              </InputGroupAddon>
              <CustomInput
                type="select"
                id="exampleCustomSelect"
                name="customSelect"
                value={gid}
                onChange={(e) => {
                  setSuccessFeedback('');
                  setError('');
                  setGidError('');
                  setGid(e.target.value);
                }}
                invalid
              >
                <option value="">Not Set</option>
                <option value="UNALLOCATED">UNALLOCATED</option>
                <option value="GID01">GID01</option>
                <option value="GID02">GID02</option>
                <option value="GID03">GID03</option>
                <option value="GID04">GID04</option>
              </CustomInput>
              <FormFeedback>{gidError}</FormFeedback>
            </InputGroup>
          </FormGroup>
        </>
      );
    }

    return (
      <>
        {/*  GID */}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>GID</InputGroupText>
            </InputGroupAddon>
            <CustomInput
              type="select"
              id="exampleCustomSelect"
              name="customSelect"
              value={gid}
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setGidError('');
                setGid(e.target.value);
              }}
            >
              <option value="">Not Set</option>
              <option value="UNALLOCATED">UNALLOCATED</option>
              <option value="GID01">GID01</option>
              <option value="GID02">GID02</option>
              <option value="GID03">GID03</option>
              <option value="GID04">GID04</option>
            </CustomInput>
          </InputGroup>
        </FormGroup>
      </>
    );
  };

  const returnPidInput = () => {
    if (pidEror) {
      return (
        <>
          {/*  PID */}
          <FormGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>PID</InputGroupText>
              </InputGroupAddon>
              <CustomInput
                type="select"
                id="exampleCustomSelect"
                name="customSelect"
                value={pid}
                onChange={(e) => {
                  setSuccessFeedback('');
                  setError('');
                  setPid(e.target.value);
                  setPidError('');
                }}
                invalid
              >
                <option value="">Not Set</option>
                <option value="PID01">PID01</option>
                <option value="PID02">PID02</option>
                <option value="PID03">PID03</option>
                <option value="PID04">PID04</option>
              </CustomInput>
              <FormFeedback>{pidEror}</FormFeedback>
            </InputGroup>
          </FormGroup>
        </>
      );
    }

    return (
      <>
        {/*  PID */}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>PID</InputGroupText>
            </InputGroupAddon>
            <CustomInput
              type="select"
              id="exampleCustomSelect"
              name="customSelect"
              value={pid}
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setPid(e.target.value);
                setPidError('');
              }}
            >
              <option value="">Not Set</option>
              <option value="PID01">PID01</option>
              <option value="PID02">PID02</option>
              <option value="PID03">PID03</option>
              <option value="PID04">PID04</option>
            </CustomInput>
          </InputGroup>
        </FormGroup>
      </>
    );
  };

  const returnObjectiveCodeInput = () => {
    if (objectiveCodeError) {
      return (
        <>
          {/*  OBJECTIVE CODE */}
          <FormGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>Objective Code</InputGroupText>
              </InputGroupAddon>
              <CustomInput
                type="select"
                id="exampleCustomSelect"
                name="customSelect"
                value={objectiveCode}
                onChange={(e) => {
                  setSuccessFeedback('');
                  setError('');
                  setObjectiveCode(e.target.value);
                  setObjectiveCodeError('');
                }}
                invalid
              >
                <option value="">Not Set</option>
                <option value="OBJ01">OBJ01</option>
                <option value="OBJ02">OBJ02</option>
                <option value="OBJ03">OBJ03</option>
                <option value="OBJ04">OBJ04</option>
              </CustomInput>
              <FormFeedback>{objectiveCodeError}</FormFeedback>
            </InputGroup>
            <FormText>Objective code is not mandatory for all programs</FormText>
          </FormGroup>
        </>
      );
    }

    return (
      <>
        {/*  OBJECTIVE CODE */}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Objective Code</InputGroupText>
            </InputGroupAddon>
            <CustomInput
              type="select"
              id="exampleCustomSelect"
              name="customSelect"
              value={objectiveCode}
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setObjectiveCode(e.target.value);
                setObjectiveCodeError('');
              }}
            >
              <option value="">Not Set</option>
              <option value="OBJ01">OBJ01</option>
              <option value="OBJ02">OBJ02</option>
              <option value="OBJ03">OBJ03</option>
              <option value="OBJ04">OBJ04</option>
            </CustomInput>
          </InputGroup>
          <FormText>Objective code is not mandatory for all programs</FormText>
        </FormGroup>
      </>
    );
  };

  return (
    <>
      <div>
        <h3>Create Procurement Request</h3>
        {returnGidInput()}
        {returnPidInput()}
        {returnObjectiveCodeInput()}
      </div>

      <div className='pushChildToBottom mb-2'>
        {/* <BackButton /> */}
        <NextButton
          activeSections={activeSections}
          currentComponent={currentComponent}
          setCurrentComponent={setCurrentComponent}
          errorProps={errorProps()}
        />
      </div>
    </>
  );
}

ProcurementInitialDetails.propTypes = {
  setSuccessFeedback: PropTypes.func,
  setError: PropTypes.func,
  setGid: PropTypes.func,
  gid: PropTypes.string,
  pid: PropTypes.string,
  setPid: PropTypes.func,
  objectiveCode: PropTypes.string,
  setObjectiveCode: PropTypes.func,
  setCurrentComponent: PropTypes.func,
  activeSections: PropTypes.array,
  currentComponent: PropTypes.object
};

export default ProcurementInitialDetails;
