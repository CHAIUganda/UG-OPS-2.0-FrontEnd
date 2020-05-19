import React from 'react';
import {
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import PropTypes from 'prop-types';

import NextButton from '../../../../common/nextButton';
import BackButton from '../../../../common/backButton';

function ProcurementInitialDetails({
  setSuccessFeedback,
  setError,
  setGid,
  gid,
  pid,
  setPid,
  objectiveCode,
  setObjectiveCode,
}) {
  return (
    <>
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
          />
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

      <BackButton />
      <NextButton />
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
};

export default ProcurementInitialDetails;
