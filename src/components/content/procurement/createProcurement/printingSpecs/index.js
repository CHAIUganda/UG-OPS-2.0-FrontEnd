import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormText
} from 'reactstrap';

const PrintingSpecs = ({
  qualityToBePrinted,
  setSuccessFeedback,
  setError,
  setQualityToBePrinted,
  detailedDescriptionOfPrint,
  setDetailedDescriptionOfPrint,
  moreDetails,
  setMoreDetails,
  accountCode,
  setAccountCode
}) => (
  <>
    <h3>Printing, Art and Design Specifications</h3>
    {/*  Quality to be printed */}
    <FormGroup>
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Quality to be printed</InputGroupText>
        </InputGroupAddon>
        <Input
          placeholder='Quality to be printed'
          type="text"
          value={qualityToBePrinted}
          onChange={(e) => {
            setSuccessFeedback('');
            setError('');
            setQualityToBePrinted(e.target.value);
          }}
          required
        />
      </InputGroup>
    </FormGroup>

    {/*  detailed description of print */}
    <FormGroup>
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Detailed description of print </InputGroupText>
        </InputGroupAddon>
        <Input
          placeholder='Detailed description of print '
          type="textarea"
          value={detailedDescriptionOfPrint}
          onChange={(e) => {
            setSuccessFeedback('');
            setError('');
            setDetailedDescriptionOfPrint(e.target.value);
          }}
        />
      </InputGroup>
    </FormGroup>

    {/*  More details */}
    <FormGroup>
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>More details if there is a need to design</InputGroupText>
        </InputGroupAddon>
        <Input
          placeholder='Provide more details if there is a need to design'
          type="textarea"
          value={moreDetails}
          onChange={(e) => {
            setSuccessFeedback('');
            setError('');
            setMoreDetails(e.target.value);
          }}
        />
      </InputGroup>
      <FormText>
        This is optional, you can provide more details if there is a need to design.
      </FormText>
    </FormGroup>

    {/*  Account code */}
    <FormGroup>
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Account code</InputGroupText>
        </InputGroupAddon>
        <Input
          placeholder='Account Code'
          type="text"
          value={accountCode}
          onChange={(e) => {
            setSuccessFeedback('');
            setError('');
            setAccountCode(e.target.value);
          }}
          required
        />
      </InputGroup>
    </FormGroup>
  </>
);

PrintingSpecs.propTypes = {
  qualityToBePrinted: PropTypes.text,
  setSuccessFeedback: PropTypes.func,
  setError: PropTypes.func,
  setQualityToBePrinted: PropTypes.func,
  detailedDescriptionOfPrint: PropTypes.text,
  setDetailedDescriptionOfPrint: PropTypes.func,
  moreDetails: PropTypes.text,
  setMoreDetails: PropTypes.func,
  accountCode: PropTypes.text,
  setAccountCode: PropTypes.func
};

export default PrintingSpecs;
