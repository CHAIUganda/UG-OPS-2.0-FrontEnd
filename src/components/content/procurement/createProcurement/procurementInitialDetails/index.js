import React, { useState, useEffect } from 'react';
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
import Select from 'react-select';

import NextButton from '../../../../common/nextButton';
import FilterNameButton from '../../../../common/filterNameButton';
// import BackButton from '../../../../common/backButton';

function ProcurementInitialDetails({
  setSuccessFeedback,
  setError,
  setGids,
  gids,
  pids,
  setPids,
  objectiveCode,
  setObjectiveCode,
  setCurrentComponent,
  activeSections,
  currentComponent
}) {
  const [gidError, setGidError] = useState('');
  const [pidEror, setPidError] = useState('');
  const [objectiveCodeError, setObjectiveCodeError] = useState('');
  const [allPIDs, setAllPIDs] = useState([]);
  const [selectedPids, setSelectedPids] = useState(pids);
  const [allGIDs, setAllGIDs] = useState([]);
  const [selectedGids, setSelectedGids] = useState(gids);

  const errorProps = () => {
    const arr = [];
    if (selectedGids.length < 1) {
      arr.push({
        err: 'Please set a GID to continue.',
        setter: setGidError
      });
    }

    if (selectedPids.length < 1) {
      arr.push({
        err: 'Please set a PID to continue.',
        setter: setPidError
      });
    }

    setPids(selectedPids);
    setGids(selectedGids);

    return arr;
  };

  const removePid = (pidToRemove) => {
    // Filter out the pid to be removed
    const arr = selectedPids.filter((p) => p !== pidToRemove);

    // set new pids without the removed one
    setSelectedPids(arr);
  };

  const generatePidsRibbon = (sPids) => {
    if (sPids.length > 0) {
      return (
        <div className="row mb-3 mt-4">
          <div className="col text-left filterRibbon">
            {
              sPids.map((selectedPid, index) => (
                <FilterNameButton
                  key={`${index}${selectedPid}`}
                  person={{ label: selectedPid, value: selectedPid }}
                  removePerson={removePid}
                />
              ))
            }
          </div>
        </div>
      );
    }

    return (
      <div className="row mt-4">
        <div className="col text-left filterRibbon">
          <div className="alert alert-primary" role="alert">
            You have not yet selected PIDs.
          </div>
        </div>
      </div>
    );
  };

  const removeGid = (gidToRemove) => {
    // Filter out the gid to be removed
    const arr = selectedGids.filter((g) => g !== gidToRemove);

    // set new gids without the removed one
    setSelectedGids(arr);
  };

  const generateGidsRibbon = (sGids) => {
    if (sGids.length > 0) {
      return (
        <div className="row mb-3 mt-4">
          <div className="col text-left filterRibbon">
            {
              sGids.map((selectedGid, index) => (
                <FilterNameButton
                  key={`${index}${selectedGid}`}
                  person={{ label: selectedGid, value: selectedGid }}
                  removePerson={removeGid}
                />
              ))
            }
          </div>
        </div>
      );
    }

    return (
      <div className="row mt-4">
        <div className="col text-left filterRibbon">
          <div className="alert alert-primary" role="alert">
            You have not yet selected GIDs.
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const pidsFromDbs = ['PID1', 'PID2', 'PID3', 'PID4', 'PID5'];
    const arrayToSet = pidsFromDbs.map((pidIter) => ({
      label: pidIter,
      value: pidIter
    }));
    setAllPIDs(arrayToSet);

    // GIDS
    const gidsFromDbs = ['GID1', 'GID2', 'GID3', 'GID4', 'GID5'];
    const GIDarrayToSet = gidsFromDbs.map((gidIter) => ({
      label: gidIter,
      value: gidIter
    }));
    setAllGIDs(GIDarrayToSet);
  },
  []);

  const addGid = (opt) => {
    setSuccessFeedback('');
    setError('');
    setGidError('');
    const a = [...selectedGids, opt.value];
    const found = selectedGids.some((g) => g === opt.value);
    if (!found) {
      setSelectedGids(a);
    }
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
              <div className="selectCustomStyle">
                <Select
                  options={allGIDs}
                  onChange={(opt) => addGid(opt) }
                />
              </div>
              <div className="alert alert-danger" role="alert">
                {gidError}
              </div>
            </InputGroup>
            <FormText>You can select more than 1 GID.</FormText>
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
            <div className="selectCustomStyle">
              <Select
                options={allGIDs}
                onChange={(opt) => addGid(opt) }
              />
            </div>
          </InputGroup>
          <FormText>You can select more than 1 GID.</FormText>
        </FormGroup>
      </>
    );
  };

  const addPid = (opt) => {
    setSuccessFeedback('');
    setError('');
    setPidError('');
    const a = [...selectedPids, opt.value];
    const found = selectedPids.some((p) => p === opt.value);
    if (!found) {
      setSelectedPids(a);
    }
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
              <div className="selectCustomStyle">
                <Select
                  options={allPIDs}
                  onChange={(opt) => addPid(opt)}
                />
              </div>
              <FormFeedback>{pidEror}</FormFeedback>
              <div className="alert alert-danger" role="alert">
                {pidEror}
              </div>
            </InputGroup>
            <FormText>You can select more than 1 PID.</FormText>
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
            <div className="selectCustomStyle">
              <Select
                options={allPIDs}
                onChange={(opt) => addPid(opt) }
              />
            </div>
          </InputGroup>
          <FormText>You can select more than 1 PID.</FormText>
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
        {generateGidsRibbon(selectedGids)}
        {returnGidInput()}
        {generatePidsRibbon(selectedPids)}
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
  setGids: PropTypes.func,
  gids: PropTypes.string,
  pids: PropTypes.string,
  setPids: PropTypes.func,
  objectiveCode: PropTypes.string,
  setObjectiveCode: PropTypes.func,
  setCurrentComponent: PropTypes.func,
  activeSections: PropTypes.array,
  currentComponent: PropTypes.object
};

export default ProcurementInitialDetails;
