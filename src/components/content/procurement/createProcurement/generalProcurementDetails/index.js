import React from 'react';
import PropTypes from 'prop-types';
// import Calendar from 'react-calendar';
import {
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormText
} from 'reactstrap';

import NextButton from '../../../../common/nextButton';
import BackButton from '../../../../common/backButton';

const GeneralDetails = ({
  setSuccessFeedback,
  setError,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  // leaveDates,
  // setLeaveDates,
  keyObjectiveAsPerCostedWorkPlan,
  setKeyObjectiveAsPerCostedWorkPlan,
  keyActivitiesAsPerCostedWorkPlan,
  setKeyActivitiesAsPerCostedWorkPlan,
  setCurrentComponent,
  activeSections,
  currentComponent,
}) => (
  <>
    <div>
      <h3>General Procurement Details</h3>
      <h6>Price range of procurement</h6>
      {/*  Minimum Price */}
      <FormGroup>
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>Minimum Price</InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder='0'
            type="number"
            value={minPrice}
            onChange={(e) => {
              setSuccessFeedback('');
              setError('');
              setMinPrice(e.target.value);
            }}
            required
          />
        </InputGroup>
      </FormGroup>

      {/* Maximum Price */}
      <FormGroup>
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>Maximum Price</InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder='0'
            type="number"
            value={maxPrice}
            onChange={(e) => {
              setSuccessFeedback('');
              setError('');
              setMaxPrice(e.target.value);
            }}
            required
          />
        </InputGroup>
      </FormGroup>

      {/* Range of dates */}
      {/* <FormGroup>
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Range of dates needed</InputGroupText>
        </InputGroupAddon>
        <Calendar
          value={leaveDates}
          selectRange={true}
          onChange={(date) => {
            setSuccessFeedback('');
            setError('');
            setLeaveDates(date);
          }
          } />
      </InputGroup>
    </FormGroup> */}

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
            }}
            required
          />
        </InputGroup>
      </FormGroup>

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
            }}
            required
          />
        </InputGroup>
        <FormText>Enter comma seperated list of activities.</FormText>
      </FormGroup>
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
        // errorProps={errorProps()}
      />
    </div>
  </>
);

GeneralDetails.propTypes = {
  setSuccessFeedback: PropTypes.func,
  setError: PropTypes.func,
  minPrice: PropTypes.number,
  setMinPrice: PropTypes.func,
  maxPrice: PropTypes.number,
  setMaxPrice: PropTypes.func,
  leaveDates: PropTypes.any,
  setLeaveDates: PropTypes.func,
  keyObjectiveAsPerCostedWorkPlan: PropTypes.string,
  setKeyObjectiveAsPerCostedWorkPlan: PropTypes.func,
  keyActivitiesAsPerCostedWorkPlan: PropTypes.string,
  setKeyActivitiesAsPerCostedWorkPlan: PropTypes.func,
  setCurrentComponent: PropTypes.func,
  activeSections: PropTypes.array,
  currentComponent: PropTypes.func,
};

export default GeneralDetails;
