/* eslint-disable no-restricted-globals */
import React, { useState } from 'react';
import { IoMdAdd, IoMdSettings } from 'react-icons/io';
import { IconContext } from 'react-icons';
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
import PropTypes from 'prop-types';
import DropzoneComponent from '../../../../../common/dropzone';

const AddPrintingSpec = ({
  addSpec,
  edit,
  specToEdit,
  editSpec,
  position
}) => {
  const [qualityToBePrinted, setQualityToBePrinted] = useState(
    edit ? specToEdit.qualityToBePrinted : ''
  );

  const [detailedDescriptionOfPrint, setDetailedDescriptionOfPrint] = useState(
    edit ? specToEdit.detailedDescriptionOfPrint : ''
  );

  const [moreDetails, setMoreDetails] = useState(
    edit ? specToEdit.moreDetails : ''
  );

  const [accountCode, setAccountCode] = useState(
    edit ? specToEdit.accountCode : ''
  );

  const [sampleNeeded, setSampleNeeded] = useState(
    edit ? specToEdit.sampleNeeded : 'No'
  ); // deafult needed

  const [colourNeeded, setColourNeeded] = useState(
    edit ? specToEdit.colourNeeded : 'Black/White'
  ); // default needed

  const [typeOfBinding, setTypeOfBinding] = useState(
    edit ? specToEdit.typeOfBinding : ''
  );

  const [typeOfPaper, setTypeOfPaper] = useState(
    edit ? specToEdit.typeOfPaper : ''
  );

  const [paperSize, setPaperSize] = useState(
    edit ? specToEdit.paperSize : ''
  );

  const [printingDatesRange, setPrintingDatesRange] = useState(
    edit ? specToEdit.printingDatesRange : null
  );

  const [success, setSuccess] = useState('');
  const [err, setErr] = useState('');

  const [minPrice, setMinPrice] = useState(
    edit ? specToEdit.minPrice : '0'
  );

  const [maxPrice, setMaxPrice] = useState(
    edit ? specToEdit.maxPrice : '0'
  );

  const [minPriceError, setMinimumPriceError] = useState('');
  const [maxPRiceError, setMaxPriceError] = useState('');
  const [qualityToBePrintedError, setQualityToBePrintedError] = useState('');
  const [detailedDescError, setDetailedDescError] = useState('');
  const [accountCodeErr, setAccountCodeErr] = useState('');
  const [typeOfBindingErr, setTypeOfBindingErr] = useState('');
  const [typeOfPaperErr, setTypeOfPaperErr] = useState('');
  const [paperSizeErr, setPaperSizeErr] = useState('');
  const [datesRangeErr, setDatesRangeErr] = useState('');

  const [specTitle, setSpecTitle] = useState(
    edit ? specToEdit.specTitle : ''
  );

  const [specTitleErr, setSpecTitleErr] = useState('');
  const [additionalDocumentations, setAdditionalDocumentations] = useState(
    edit ? specToEdit.additionalDocumentations : []
  );

  const [modal, setModal] = useState(false);
  let filesHolder = edit ? specToEdit.additionalDocumentations : [];

  const toggle = (event) => {
    event.preventDefault();
    setModal(!modal);
  };

  const resetFilesArrays = () => {
    filesHolder = [];
    setAdditionalDocumentations(filesHolder);
  };

  const reset = () => {
    setQualityToBePrinted('');
    setDetailedDescriptionOfPrint('');
    setMoreDetails('');
    setAccountCode('');
    setSampleNeeded('No');
    setColourNeeded('Black/White');
    setTypeOfBinding('');
    setTypeOfPaper('');
    setPaperSize('');
    setPrintingDatesRange('');
    setMinPrice('');
    setMaxPrice('');
    setSpecTitle('');

    setSuccess('');
    setErr('');

    resetFilesArrays();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let addEntry = true;

    if (!edit && (!minPrice || !minPrice.trim())) {
      setMinimumPriceError('Enter a valid number.');
      setErr('Enter a valid number  for minimum price.');
      addEntry = false;
    }

    if (edit && !minPrice) {
      setMinimumPriceError('Enter a valid number.');
      setErr('Enter a valid number  for minimum price.');
      addEntry = false;
    }

    if (isNaN(minPrice)) {
      setMinimumPriceError('Enter a valid decimal number.');
      setErr('Enter a valid decimal number  for minimum price.');
      addEntry = false;
    }

    if (parseFloat(minPrice) < 1) {
      setErr('Set a minimum price higher than 1.');
      setMinimumPriceError('Set a minimum price higher than 1.');
      addEntry = false;
    }

    if (!edit && (!maxPrice || !maxPrice.trim())) {
      setErr('Enter a valid number for maximum price.');
      setMaxPriceError('Enter a valid number.');
      addEntry = false;
    }

    if (edit && !maxPrice) {
      setMinimumPriceError('Enter a valid number.');
      setErr('Enter a valid number  for minimum price.');
      addEntry = false;
    }

    if (isNaN(maxPrice)) {
      setErr('Enter a valid decimal number for maximum price.');
      setMaxPriceError('Enter a valid decimal number.');
      addEntry = false;
    }

    if (parseFloat(maxPrice) < 1) {
      setErr('Set a maximum price higher than 1.');
      setMaxPriceError('Set a maximum price higher than 1.');
      addEntry = false;
    }

    if (parseFloat(maxPrice) < parseFloat(minPrice)) {
      setErr('Set a maximum price higher than the minimum price.');
      setMaxPriceError('Set a maximum price higher the minimum price.');
      addEntry = false;
    }

    if (qualityToBePrinted.trim().length < 1) {
      setErr('Specify a quality to be printed.');
      setQualityToBePrintedError('specify a quality to be printed');
      addEntry = false;
    }

    if (detailedDescriptionOfPrint.trim().length < 1) {
      setErr('Describe the print in detail.');
      setDetailedDescError('Describe the print in detail.');
      addEntry = false;
    }

    if (accountCode.trim().length < 1) {
      setErr('Select an account code.');
      setAccountCodeErr('Select an account code.');
      addEntry = false;
    }

    if (typeOfBinding.trim().length < 1) {
      setErr('Specify a type of binding.');
      setTypeOfBindingErr('Specify a type of binding.');
      addEntry = false;
    }

    if (typeOfPaper.trim().length < 1) {
      setErr('Specify the type of paper to be used.');
      setTypeOfPaperErr('Specify the type of paper to be used.');
      addEntry = false;
    }

    if (paperSize.trim().length < 1) {
      setErr('Specify a paper size.');
      setPaperSizeErr('Specify a paper size.');
      addEntry = false;
    }

    if (!printingDatesRange) {
      setErr('Select a range of dates.');
      setDatesRangeErr('Select a range of dates.');
      addEntry = false;
    }

    if (specTitle.trim().length < 1) {
      setErr('Set a specification title.');
      setSpecTitleErr('Set a specification title.');
      addEntry = false;
    }

    const newSpec = {
      specTitle: specTitle.trim(),
      minPrice: parseFloat(minPrice),
      maxPrice: parseFloat(maxPrice),
      qualityToBePrinted: qualityToBePrinted.trim(),
      detailedDescriptionOfPrint: detailedDescriptionOfPrint.trim(),
      moreDetails: moreDetails.trim(),
      accountCode: accountCode.trim(),
      sampleNeeded: sampleNeeded.trim(),
      colourNeeded: colourNeeded.trim(),
      typeOfBinding: typeOfBinding.trim(),
      typeOfPaper: typeOfPaper.trim(),
      paperSize: paperSize.trim(),
      printingDatesRange,
      additionalDocumentations,
    };

    if (addEntry) {
      if (edit) {
        editSpec(position, newSpec);
        toggle();
        return;
      }
      addSpec(newSpec);
      reset();
      toggle();
    }
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

  const printQualityInput = () => {
    if (qualityToBePrintedError) {
      return (
        <>
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
                  setQualityToBePrintedError('');
                  setQualityToBePrinted(e.target.value);
                }}
                invalid
              />
              <FormFeedback>{qualityToBePrintedError}</FormFeedback>
            </InputGroup>
          </FormGroup>
        </>
      );
    }
    return (
      <>
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
                setQualityToBePrintedError('');
                setQualityToBePrinted(e.target.value);
              }}
              required
            />
          </InputGroup>
        </FormGroup>
      </>
    );
  };

  const detailedPrintDescInput = () => {
    if (detailedDescError) {
      return (
        <>
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
                  setDetailedDescError('');
                  setDetailedDescriptionOfPrint(e.target.value);
                }}
                invalid
              />
              <FormFeedback>{detailedDescError}</FormFeedback>
            </InputGroup>
          </FormGroup>
        </>
      );
    }
    return (
      <>
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
                setDetailedDescError('');
                setDetailedDescriptionOfPrint(e.target.value);
              }}
            />
          </InputGroup>
        </FormGroup>
      </>
    );
  };

  const moreDetailsIput = () => {
    return (
      <>
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
      </>
    );
  };

  const accountCodeInput = () => {
    if (accountCodeErr) {
      return (
        <>
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
                  setAccountCodeErr('');
                  setAccountCode(e.target.value);
                }}
                invalid
              >
                <option value="">Not Set</option>
                <option value="AC01">AC01</option>
                <option value="AC02">AC02</option>
                <option value="AC03">AC03</option>
                <option value="AC04">AC04</option>
              </CustomInput>
              <FormFeedback>{accountCodeErr}</FormFeedback>
            </InputGroup>
          </FormGroup>
        </>
      );
    }
    return (
      <>
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
                setAccountCodeErr('');
                setAccountCode(e.target.value);
              }}
            >
              <option value="">Not Set</option>
              <option value="AC01">AC01</option>
              <option value="AC02">AC02</option>
              <option value="AC03">AC03</option>
              <option value="AC04">AC04</option>
            </CustomInput>
          </InputGroup>
        </FormGroup>
      </>
    );
  };

  const sampleNeededInput = () => {
    return (
      <>
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
      </>
    );
  };

  const colourNeededInput = () => {
    return (
      <>
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
      </>
    );
  };

  const typeOfBindingInput = () => {
    if (typeOfBindingErr) {
      return (
        <>
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
                  setTypeOfBindingErr('');
                  setTypeOfBinding(e.target.value);
                }}
                invalid
              />
              <FormFeedback>{typeOfBindingErr}</FormFeedback>
            </InputGroup>
          </FormGroup>
        </>
      );
    }
    return (
      <>
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
                setTypeOfBindingErr('');
                setTypeOfBinding(e.target.value);
              }}
            />
          </InputGroup>
        </FormGroup>
      </>
    );
  };

  const typeOfPaperInput = () => {
    if (typeOfPaperErr) {
      return (
        <>
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
                  setTypeOfPaperErr('');
                  setTypeOfPaper(e.target.value);
                }}
                invalid
              />
              <FormFeedback>{typeOfPaperErr}</FormFeedback>
            </InputGroup>
          </FormGroup>
        </>
      );
    }
    return (
      <>
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
                setTypeOfPaperErr('');
                setTypeOfPaper(e.target.value);
              }}
            />
          </InputGroup>
        </FormGroup>
      </>
    );
  };

  const paperSizeInput = () => {
    if (paperSizeErr) {
      return (
        <>
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
                  setPaperSizeErr('');
                  setPaperSize(e.target.value);
                }}
                required
                invalid
              />
              <FormFeedback>{paperSizeErr}</FormFeedback>
            </InputGroup>
          </FormGroup>
        </>
      );
    }
    return (
      <>
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
                setPaperSizeErr('');
                setPaperSize(e.target.value);
              }}
              required
            />
          </InputGroup>
        </FormGroup>
      </>
    );
  };

  const rangeOfDatesInput = () => {
    return (
      <>
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
                setDatesRangeErr('');
                setPrintingDatesRange(date);
              }
              } />
          </InputGroup>
          {
            datesRangeErr
              ? <div className="alert alert-danger" role="alert">
                {datesRangeErr}
              </div>
              : <></>
          }
        </FormGroup>
      </>
    );
  };

  const specTitleInput = () => {
    if (specTitleErr) {
      return (
        <>
          {/*  spec title */}
          <FormGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>Specification Title</InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder='General title'
                type="text"
                value={specTitle}
                onChange={(e) => {
                  setSuccess('');
                  setErr('');
                  setSpecTitleErr('');
                  setSpecTitle(e.target.value);
                }}
                required
                invalid
              />
              <FormFeedback>{specTitleErr}</FormFeedback>
            </InputGroup>
            <FormText>A general title to differentiate specifications.</FormText>
          </FormGroup>
        </>
      );
    }
    return (
      <>
        {/*  Spec title */}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Specification Title</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder='General title'
              type="text"
              value={specTitle}
              onChange={(e) => {
                setSuccess('');
                setErr('');
                setSpecTitleErr('');
                setSpecTitle(e.target.value);
              }}
              required
            />
          </InputGroup>
          <FormText>A general title to differentiate specifications.</FormText>
        </FormGroup>
      </>
    );
  };

  const fileError = (file, message) => {
    setErr(`File error :: ${file.name}: ${message}`);
  };

  const addFile = (file) => {
    setSuccess('');
    setErr('');
    filesHolder.push(file);
    setAdditionalDocumentations([...filesHolder]);
  };

  const removeFile = (file) => {
    setSuccess('');
    setErr('');
    const indexOfFile = filesHolder.indexOf(file);
    filesHolder.splice(indexOfFile, 1);
    setAdditionalDocumentations(filesHolder);
  };

  const dropzoneInput = () => {
    return (
      <>
        {/*  dropzone */}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Additional documations</InputGroupText>
            </InputGroupAddon>
            <div>
              <DropzoneComponent
                fileError={fileError}
                addFile={addFile}
                removeFile={removeFile}
                dropzoneID={'printingExtraDocs'}
                initialFiles={filesHolder}
                resetFilesArrays={resetFilesArrays}
              />
            </div>
          </InputGroup>
          <FormText>
                  Attach any additional suppporting documations.
          </FormText>
        </FormGroup>
      </>
    );
  };

  const returnIcon = () => {
    if (edit) {
      return (
        <span onClick={toggle}>
          <IconContext.Provider value={{ size: '2em' }}>
            <IoMdSettings />
          </IconContext.Provider>
        </span>
      );
    }

    return (
      <button className="submitButton positionBtn" onClick={toggle}>
        <IoMdAdd />
        Add Specification
      </button>
    );
  };

  const submitButtonText = () => {
    if (edit) {
      return (
        <>
          <button className="submitButton positionBtn pull-left" type='submit' onClick={handleSubmit}>
            Edit
          </button>
        </>
      );
    }

    return (
      <>
        <button className="submitButton positionBtn pull-left" type='submit' onClick={handleSubmit}>
          <IoMdAdd />
          Add Specification
        </button>
      </>);
  };

  return (
    <div className="inlineItem">
      {returnIcon()}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Printing Specifications</ModalHeader>
        <ModalBody>
          <Form>
            {err && <div className="errorFeedback m-2"> {err} </div>}
            {success && <div className="errorFeedback m-2"> {success} </div>}
            {specTitleInput()}
            <h6>Price range of procurement</h6>
            {minPriceInput()}
            {maxPriceInput()}
            {printQualityInput()}
            {detailedPrintDescInput()}
            {moreDetailsIput()}
            {accountCodeInput()}
            {sampleNeededInput()}
            {colourNeededInput()}
            {typeOfBindingInput()}
            {typeOfPaperInput()}
            {paperSizeInput()}
            {rangeOfDatesInput()}
            {dropzoneInput()}
            {err && <div className="errorFeedback m-2"> {err} </div>}
            {success && <div className="errorFeedback m-2"> {success} </div>}
            <div>
              {submitButtonText()}
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}></Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

AddPrintingSpec.propTypes = {
  addSpec: PropTypes.func,
  edit: PropTypes.bool,
  specToEdit: PropTypes.object,
  editSpec: PropTypes.func,
  position: PropTypes.number
};

export default AddPrintingSpec;
