/* eslint-disable no-restricted-globals */
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
  FormGroup,
  FormFeedback
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
  const [minPriceError, setMinimumPriceError] = useState('');
  const [maxPRiceError, setMaxPriceError] = useState('');

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isNaN(parseFloat(minPrice))) {
      setMinimumPriceError('Enter a valid decimal number.');
      setErr('Enter a valid decimal number  for minimum price.');
      return;
    }

    if (parseFloat(minPrice) < 1) {
      setErr('Set a minimum price higher than 1.');
      setMinimumPriceError('Set a minimum price higher than 1.');
      return;
    }

    if (isNaN(parseFloat(maxPrice))) {
      setErr('Enter a valid decimal number for maximum price.');
      setMaxPriceError('Enter a valid decimal number.');
      return;
    }

    if (parseFloat(maxPrice) < 1) {
      setErr('Set a maximum price higher than 1.');
      setMaxPriceError('Set a maximum price higher than 1.');
      return;
    }

    if (parseFloat(maxPrice) < parseFloat(minPrice)) {
      setErr('Set a maximum price higher than the minimum price.');
      setMaxPriceError('Set a maximum price higher the minimum price.');
      return;
    }

    const newSpec = {
      minPrice,
      maxPrice
    };

    // toggle();
    console.log(newSpec);
    debugger;
  };

  const minPriceInput = () => {
    if (minPriceError) {
      return (
        <>
          {/*  Minimum Price */}
          <FormGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>Minimum Price</InputGroupText>
              </InputGroupAddon>
              <Input
                type="number"
                value={minPrice}
                onChange={(e) => {
                  setSuccess('');
                  setErr('');
                  setMinPrice(e.target.value);
                  setMinimumPriceError('');
                }}
                invalid
              />
              <FormFeedback>{minPriceError}</FormFeedback>
            </InputGroup>
          </FormGroup>
        </>
      );
    }

    return (
      <>
        {/*  Minimum Price */}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Minimum Price</InputGroupText>
            </InputGroupAddon>
            <Input
              type="number"
              value={minPrice}
              onChange={(e) => {
                setSuccess('');
                setErr('');
                setMinPrice(e.target.value);
                setMinimumPriceError('');
              }}
            />
          </InputGroup>
        </FormGroup>
      </>
    );
  };

  const maxPriceInput = () => {
    if (maxPRiceError) {
      return (
        <>
          {/* Maximum Price invalid */}
          <FormGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>Maximum Price</InputGroupText>
              </InputGroupAddon>
              <Input
                type="number"
                value={maxPrice}
                onChange={(e) => {
                  setSuccess('');
                  setErr('');
                  setMaxPriceError('');
                  setMaxPrice(e.target.value);
                }}
                invalid
              />
              <FormFeedback>{maxPRiceError}</FormFeedback>
            </InputGroup>
          </FormGroup>
        </>
      );
    }

    return (
      <>
        {/* Maximum Price valid */}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Maximum Price</InputGroupText>
            </InputGroupAddon>
            <Input
              type="number"
              value={maxPrice}
              onChange={(e) => {
                setSuccess('');
                setErr('');
                setMaxPriceError('');
                setMaxPrice(e.target.value);
              }}
              required
            />
          </InputGroup>
        </FormGroup>
      </>
    );
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
          <Form>
            {err && <div className="errorFeedback m-2"> {err} </div>}
            {success && <div className="errorFeedback m-2"> {success} </div>}
            <h6>Price range of procurement</h6>
            {minPriceInput()}
            {maxPriceInput()}
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
                  required
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
                <CustomInput
                  type="select"
                  id="exampleCustomSelect"
                  name="customSelect"
                  value={accountCode}
                  onChange={(e) => {
                    setSuccess('');
                    setErr('');
                    setAccountCode(e.target.value);
                  }}
                >
                  <option value="">Not Set</option>
                  <option value="PID01">AC01</option>
                  <option value="PID02">AC02</option>
                  <option value="PID03">AC03</option>
                  <option value="PID04">AC04</option>
                </CustomInput>
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
            {err && <div className="errorFeedback m-2"> {err} </div>}
            {success && <div className="errorFeedback m-2"> {success} </div>}
            <div>
              <button className="submitButton positionBtn pull-left" type='submit' onClick={handleSubmit}>
                <IoMdAdd />
              Add Specification
              </button>
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

AddPrintingSpec.propTypes = {

};

export default AddPrintingSpec;
