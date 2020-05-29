import React, { useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Input,
  CustomInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormText,
  FormGroup
} from 'reactstrap';
import Calendar from 'react-calendar';
import DropzoneComponent from '../../../../../common/dropzone';

// import PropTypes from 'prop-types';

const AddPrintingSpec = () => {
  const [qualityToBePrinted, setQualityToBePrinted] = useState('');
  const [detailedDescriptionOfPrint, setDetailedDescriptionOfPrint] = useState('');
  const [moreDetails, setMoreDetails] = useState('');
  const [accountCode, setAccountCode] = useState('');
  const [sampleNeeded, setSampleNeeded] = useState('No');
  const [colourNeeded, setColourNeeded] = useState('Black/White');
  const [typeOfBinding, setTypeOfBinding] = useState('');
  const [typeOfPaper, setTypeOfPaper] = useState('');
  const [paperSize, setPaperSize] = useState('');
  const [printingDatesRange, setPrintingDatesRange] = useState();
  const [success, setSuccess] = useState('');
  const [err, setErr] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="inlineItem">
      <button className="submitButton positionBtn" onClick={toggle}>
        <IoMdAdd />
            Add Specification
      </button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Printing Specifications</ModalHeader>
        <ModalBody>
          <Form onsubmit={handleSubmit}>
            {err && <div className="errorFeedback m-2"> {err} </div>}
            {success && <div className="errorFeedback m-2"> {success} </div>}
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
                    setSuccess('');
                    setErr('');
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
                    setSuccess('');
                    setErr('');
                    setMaxPrice(e.target.value);
                  }}
                  required
                />
              </InputGroup>
            </FormGroup>
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
                    setSuccess('');
                    setErr('');
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
                    setSuccess('');
                    setErr('');
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
                    setSuccess('');
                    setErr('');
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
                    setSuccess('');
                    setErr('');
                    setAccountCode(e.target.value);
                  }}
                  required
                />
              </InputGroup>
            </FormGroup>

            {/* is a sample needed? */}
            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Sample Needed?</InputGroupText>
                </InputGroupAddon>
                <CustomInput
                  type="select"
                  id="sampleCustomSelect"
                  name="customSelect"
                  value={sampleNeeded}
                  onChange={(e) => {
                    setSuccess('');
                    setErr('');
                    setSampleNeeded(e.target.value);
                  }}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </CustomInput>
              </InputGroup>
            </FormGroup>

            {/* Color needed? */}
            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Color Needed?</InputGroupText>
                </InputGroupAddon>
                <CustomInput
                  type="select"
                  id="colorSelect"
                  name="customSelect"
                  value={colourNeeded}
                  onChange={(e) => {
                    setSuccess('');
                    setErr('');
                    setColourNeeded(e.target.value);
                  }}
                >
                  <option value="Black/White">Black/White</option>
                  <option value="Colour">Colour</option>
                </CustomInput>
              </InputGroup>
            </FormGroup>

            {/*  Type of binding */}
            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Type Of Binding</InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder='Type of binding'
                  type="text"
                  value={typeOfBinding}
                  onChange={(e) => {
                    setSuccess('');
                    setErr('');
                    setTypeOfBinding(e.target.value);
                  }}
                  required
                />
              </InputGroup>
            </FormGroup>

            {/*  Type of Paper */}
            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Type Of Paper</InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder='Type of paper'
                  type="text"
                  value={typeOfPaper}
                  onChange={(e) => {
                    setSuccess('');
                    setErr('');
                    setTypeOfPaper(e.target.value);
                  }}
                  required
                />
              </InputGroup>
            </FormGroup>

            {/*  Paper Size */}
            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Paper Size</InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder='Paper size'
                  type="text"
                  value={paperSize}
                  onChange={(e) => {
                    setSuccess('');
                    setErr('');
                    setPaperSize(e.target.value);
                  }}
                  required
                />
              </InputGroup>
            </FormGroup>

            {/* Range of dates */}
            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Range of dates needed</InputGroupText>
                </InputGroupAddon>
                <Calendar
                  value={printingDatesRange}
                  selectRange={true}
                  onChange={(date) => {
                    setSuccess('');
                    setErr('');
                    setPrintingDatesRange(date);
                  }
                  } />
              </InputGroup>
            </FormGroup>

            {/*  dropzone */}
            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Additional documations</InputGroupText>
                </InputGroupAddon>
                <div>
                  <DropzoneComponent />
                </div>
              </InputGroup>
              <FormText>
                  Attach any additional suppporting documations.
              </FormText>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>Do Something</Button>{' '}
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

AddPrintingSpec.propTypes = {

};

export default AddPrintingSpec;
