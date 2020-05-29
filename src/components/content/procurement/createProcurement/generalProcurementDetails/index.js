import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import Calendar from 'react-calendar';
import {
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormText,
  FormFeedback
} from 'reactstrap';

import NextButton from '../../../../common/nextButton';
import BackButton from '../../../../common/backButton';

const GeneralDetails = ({
  setSuccessFeedback,
  setError,
  keyObjectiveAsPerCostedWorkPlan,
  setKeyObjectiveAsPerCostedWorkPlan,
  keyActivitiesAsPerCostedWorkPlan,
  setKeyActivitiesAsPerCostedWorkPlan,
  setCurrentComponent,
  activeSections,
  currentComponent,
}) => {
  const [objectiveInputInvalid, setObjectiveInputInvalid] = useState('');
  const [keyActivitiesInvalid, setKeyActivitiesInvalid] = useState('');

  const errorProps = () => {
    const arr = [];
    if (!keyObjectiveAsPerCostedWorkPlan) {
      arr.push({
        err: 'Please add the key objective to continue.',
        setter: setObjectiveInputInvalid
      });
    }

    if (!keyActivitiesAsPerCostedWorkPlan) {
      arr.push({
        err: 'Please add at least an acitivity',
        setter: setKeyActivitiesInvalid
      });
    }

    return arr;
  };

  const returnObjectiveInput = () => {
    if (objectiveInputInvalid) {
      return (
        <>
          {/* costed work plan objective */}
          <FormGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>Key Objective as Per Costed Work Plan</InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder='Key Objective as Per Costed Work Plan'
                type="text"
                value={keyObjectiveAsPerCostedWorkPlan}
                onChange={(e) => {
                  setSuccessFeedback('');
                  setError('');
                  setKeyObjectiveAsPerCostedWorkPlan(e.target.value);
                  setObjectiveInputInvalid('');
                }}
                invalid
              />
              <FormFeedback>{objectiveInputInvalid}</FormFeedback>
            </InputGroup>
          </FormGroup>
        </>
      );
    }

    return (
      <>
        {/* costed work plan objective */}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Key Objective as Per Costed Work Plan</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder='Key Objective as Per Costed Work Plan'
              type="text"
              value={keyObjectiveAsPerCostedWorkPlan}
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setKeyObjectiveAsPerCostedWorkPlan(e.target.value);
                setObjectiveInputInvalid('');
              }}
              required
            />
            <FormFeedback>{objectiveInputInvalid}</FormFeedback>
          </InputGroup>
        </FormGroup>
      </>
    );
  };

  const returnKeyActivitiesInput = () => {
    if (keyActivitiesInvalid) {
      return (
        <>
          {/* key activities as per costed work plan */}
          <FormGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
            Key Activities as Per Costed Work Plan
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder='Key Activities as Per Costed Work Plan'
                type="text"
                value={keyActivitiesAsPerCostedWorkPlan}
                onChange={(e) => {
                  setSuccessFeedback('');
                  setError('');
                  setKeyActivitiesAsPerCostedWorkPlan(e.target.value);
                  setKeyActivitiesInvalid();
                }}
                invalid
              />
              <FormFeedback>{keyActivitiesInvalid}</FormFeedback>
            </InputGroup>
            <FormText>Enter comma seperated list of activities.</FormText>
          </FormGroup>
        </>
      );
    }

    return (
      <>
        {/* key activities as per costed work plan */}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
            Key Activities as Per Costed Work Plan
              </InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder='Key Activities as Per Costed Work Plan'
              type="text"
              value={keyActivitiesAsPerCostedWorkPlan}
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setKeyActivitiesAsPerCostedWorkPlan(e.target.value);
                setKeyActivitiesInvalid();
              }}
              required
            />
          </InputGroup>
          <FormText>Enter comma seperated list of activities.</FormText>
        </FormGroup>
      </>
    );
  };

  return (
    <>
      <div>
        <h3>General Procurement Details</h3>
        {returnObjectiveInput()}
        {returnKeyActivitiesInput()}
      </div>
      <div className='pushChildToBottom mb-2'>
        <BackButton
          activeSections={activeSections}
          currentComponent={currentComponent}
          setCurrentComponent={setCurrentComponent}
        />
        <NextButton
          activeSections={activeSections}
          currentComponent={currentComponent}
          setCurrentComponent={setCurrentComponent}
          errorProps={errorProps()}
        />
      </div>
    </>
  );
};

GeneralDetails.propTypes = {
  setSuccessFeedback: PropTypes.func,
  setError: PropTypes.func,
  keyObjectiveAsPerCostedWorkPlan: PropTypes.string,
  setKeyObjectiveAsPerCostedWorkPlan: PropTypes.func,
  keyActivitiesAsPerCostedWorkPlan: PropTypes.string,
  setKeyActivitiesAsPerCostedWorkPlan: PropTypes.func,
  setCurrentComponent: PropTypes.func,
  activeSections: PropTypes.array,
  currentComponent: PropTypes.func,
};

export default GeneralDetails;
