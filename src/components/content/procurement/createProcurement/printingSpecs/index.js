import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';
import {
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormText,
  CustomInput
} from 'reactstrap';
import * as DropzoneLib from 'dropzone';

import NextButton from '../../../../common/nextButton';
import BackButton from '../../../../common/backButton';

import 'dropzone/dist/dropzone.css';

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
  setAccountCode,
  sampleNeeded,
  setSampleNeeded,
  colourNeeded,
  setColourNeeded,
  typeOfBinding,
  setTypeOfBinding,
  typeOfPaper,
  setTypeOfPaper,
  paperSize,
  setPaperSize,
  printingDatesRange,
  setPrintingDatesRange,
  //
  setCurrentComponent,
  activeSections,
  currentComponent,
}) => {
  const dropzoneNode = React.createRef();
  // eslint-disable-next-line no-unused-vars
  let dropzone;
  const filesArray = [];

  // eslint-disable-next-line no-unused-vars
  const onFileError = (file, message) => {
    setError(`${file.name} :: message`);
  };

  const onAddFile = (file) => {
    filesArray.push(file);
    setError('');
    setSuccessFeedback('');
  };

  const onRemoveFile = (file) => {
    const indexOfFile = filesArray.indexOf(file);
    filesArray.splice(indexOfFile, 1);
    setError('');
    setSuccessFeedback('');
  };

  const setupDropzone = () => {
    const dropzoneArea = new DropzoneLib('div#d', {
      url: '/not/required/',
      dictDefaultMessage: 'Drop files or click to upload',
      uploadMultiple: true,
      autoProcessQueue: false,
      addRemoveLinks: true,
      createImageThumbnails: true,
    });

    dropzoneArea.on('error', (file, message) => console.log(message));

    dropzoneArea.on('addedfile', onAddFile);

    dropzoneArea.on('removedfile', onRemoveFile);

    return dropzoneArea;
  };

  const returnNextButton = () => {
    const currentIndex = activeSections.indexOf(currentComponent[0]);
    if (currentIndex !== -1 && currentIndex < activeSections.length) {
      if (currentIndex === activeSections.length - 1) {
        return (
          <NextButton
            finish={true}
            setCurrentComponent={setCurrentComponent}
            // activeSections={activeSections}
            // currentComponent={currentComponent}
          // errorProps={errorProps()}
          />
        );
      }
      return (
        <NextButton
          activeSections={activeSections}
          currentComponent={currentComponent}
          setCurrentComponent={setCurrentComponent}
          // errorProps={errorProps()}
        />
      );
    }

    return <p>nothing</p>;
  };

  useEffect(() => {
    dropzone = setupDropzone();
    return function destroyDropZone() {
      dropzone.destroy();
    };
  }, []);

  return (
    <>
      <div>
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
                setSuccessFeedback('');
                setError('');
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
                setSuccessFeedback('');
                setError('');
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
                setSuccessFeedback('');
                setError('');
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
                setSuccessFeedback('');
                setError('');
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
                setSuccessFeedback('');
                setError('');
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
                setSuccessFeedback('');
                setError('');
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
            <div ref={dropzoneNode} id='d' className='dropzone'></div>
          </InputGroup>
          <FormText>
          Attach any additional suppporting documations.
          </FormText>
        </FormGroup>
      </div>

      <div className='pushChildToBottom mb-2'>
        <BackButton
          activeSections={activeSections}
          currentComponent={currentComponent}
          setCurrentComponent={setCurrentComponent}
        />
        {returnNextButton()}
      </div>
    </>
  );
};

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
  setAccountCode: PropTypes.func,
  sampleNeeded: PropTypes.string,
  setSampleNeeded: PropTypes.func,
  colourNeeded: PropTypes.string,
  setColourNeeded: PropTypes.func,
  typeOfBinding: PropTypes.string,
  setTypeOfBinding: PropTypes.func,
  typeOfPaper: PropTypes.string,
  setTypeOfPaper: PropTypes.func,
  paperSize: PropTypes.string,
  setPaperSize: PropTypes.func,
  printingDatesRange: PropTypes.array,
  setPrintingDatesRange: PropTypes.func,
  setCurrentComponent: PropTypes.func,
  activeSections: PropTypes.array,
  currentComponent: PropTypes.array,
};

export default PrintingSpecs;
