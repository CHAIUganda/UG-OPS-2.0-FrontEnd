import React from 'react';
import {
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormFeedback,
  CustomInput
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
  return (
    <>
      <div>
        <h3>Create Procurement Request</h3>
        {/*  GID */}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>GID</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="GID"
              type="text"
              value={gid}
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setGid(e.target.value);
              }}
              required
              invalid
            />
            <FormFeedback>Oh noes! that name is already taken</FormFeedback>
          </InputGroup>
        </FormGroup>

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
            <FormFeedback>Please set a GID to continue</FormFeedback>
          </InputGroup>
        </FormGroup>

        {/*  PID */}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>PID</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="PID"
              type="text"
              value={pid}
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setPid(e.target.value);
              }}
              required
            />
          </InputGroup>
        </FormGroup>

        {/*  OBJECTIVE CODE */}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Objective Code</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Objective Code"
              type="text"
              value={objectiveCode}
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setObjectiveCode(e.target.value);
              }}
              required
            />
          </InputGroup>
        </FormGroup>

      </div>

      <div className='pushChildToBottom mb-2'>
        {/* <BackButton /> */}
        <NextButton
          activeSections={activeSections}
          currentComponent={currentComponent}
          setCurrentComponent={setCurrentComponent}
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
