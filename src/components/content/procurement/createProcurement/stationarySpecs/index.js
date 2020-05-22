import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  // FormText,
  // CustomInput
} from 'reactstrap';

const StationarySpecs = ({
  setError,
  setSuccessFeedback,
  itemRequests,
  setItemRequests,
  quantitiesRequired,
  setQuantitiesRequired
// eslint-disable-next-line arrow-body-style
}) => {
  return (
    <>
      <h3>Stationary Specifications</h3>

      {/*  Item requests */}
      <FormGroup>
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>Item Requests</InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder='Comma seperated list of items.'
            type="text"
            value={itemRequests}
            onChange={(e) => {
              setSuccessFeedback('');
              setError('');
              setItemRequests(e.target.value);
            }}
            required
          />
        </InputGroup>
      </FormGroup>

      {/*  Quantities required */}
      <FormGroup>
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>Quantities Required</InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder='Comma seperated list of item and its quantity.'
            type="text"
            value={quantitiesRequired}
            onChange={(e) => {
              setSuccessFeedback('');
              setError('');
              setQuantitiesRequired(e.target.value);
            }}
            required
          />
        </InputGroup>
      </FormGroup>
    </>
  );
};

StationarySpecs.propTypes = {
  setSuccessFeedback: PropTypes.func,
  setError: PropTypes.func,
  itemRequests: PropTypes.string,
  setItemRequests: PropTypes.func,
  quantitiesRequired: PropTypes.string,
  setQuantitiesRequired: PropTypes.func,
};

export default StationarySpecs;
