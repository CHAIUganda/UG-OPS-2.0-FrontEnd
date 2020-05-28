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
  // CustomInput
} from 'reactstrap';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import * as DropzoneLib from 'dropzone';

import 'dropzone/dist/dropzone.css';
import 'rc-time-picker/assets/index.css';

import NextButton from '../../../../common/nextButton';
import BackButton from '../../../../common/backButton';

const CarHireSpecifications = ({
  setSuccessFeedback,
  setError,
  typeOfCar,
  setTypeOfCar,
  districtsToBeVisited,
  setDistrictsToBeVisited,
  numberOfCars,
  setNumberOfCars,
  numberOfDays,
  setNumberOfDays,
  numberOfNights,
  setNumberOfNights,
  pickUpTime,
  setPickUpTime,
  pickUpLocation,
  setPickUpLocation,
  carHireDatesRange,
  setcarHireDatesRange,
  setCurrentComponent,
  activeSections,
  currentComponent,
}) => {
  const carHireDropzoneNode = React.createRef();
  // eslint-disable-next-line no-unused-vars
  let carHireDropzone;
  const carHireFilesArray = [];

  // eslint-disable-next-line no-unused-vars
  const onFileError = (file, message) => {
    setError(`${file.name} :: message`);
  };

  const onAddFile = (file) => {
    carHireFilesArray.push(file);
    setError('');
    setSuccessFeedback('');
  };

  const onRemoveFile = (file) => {
    const indexOfFile = carHireFilesArray.indexOf(file);
    carHireFilesArray.splice(indexOfFile, 1);
    setError('');
    setSuccessFeedback('');
  };

  const setupDropzone = () => {
    const carHireDropzoneArea = new DropzoneLib('div#cadHireDiv', {
      url: '/not/required/',
      dictDefaultMessage: 'Drop files or click to upload',
      uploadMultiple: true,
      autoProcessQueue: false,
      addRemoveLinks: true,
      createImageThumbnails: true,
    });

    carHireDropzoneArea.on('error', (file, message) => console.log(message));

    carHireDropzoneArea.on('addedfile', onAddFile);

    carHireDropzoneArea.on('removedfile', onRemoveFile);

    return carHireDropzoneArea;
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

    return <></>;
  };

  useEffect(() => {
    carHireDropzone = setupDropzone();
  }, []);

  return (
    <>
      <div>
        <h3>Car Hire Specifications</h3>
        {/* Range of dates */}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Range of dates needed</InputGroupText>
            </InputGroupAddon>
            <Calendar
              value={carHireDatesRange}
              selectRange={true}
              onChange={(date) => {
                setSuccessFeedback('');
                setError('');
                setcarHireDatesRange(date);
              }
              } />
          </InputGroup>
        </FormGroup>

        {/*  Type of car */}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Type Of Car</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder='Type of car'
              type="text"
              value={typeOfCar}
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setTypeOfCar(e.target.value);
              }}
              required
            />
          </InputGroup>
        </FormGroup>

        {/* Districts to be visited */}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Districts To Be Visited</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder='Districts To Be Visited'
              type="text"
              value={districtsToBeVisited}
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setDistrictsToBeVisited(e.target.value);
              }}
              required
            />
          </InputGroup>
          <FormText>Supply a comma seperated list of districts to be visited.</FormText>
        </FormGroup>

        {/*  Number of cars */}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Number of Cars</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder='0'
              type="number"
              value={numberOfCars}
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setNumberOfCars(e.target.value);
              }}
              required
            />
          </InputGroup>
        </FormGroup>

        {/*  Duration of trip. */}
        <h6>Duration Of Trip</h6>
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Number of Days</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder='0'
              type="number"
              value={numberOfDays}
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setNumberOfDays(e.target.value);
              }}
              required
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Number of Nights</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder='0'
              type="number"
              value={numberOfNights}
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setNumberOfNights(e.target.value);
              }}
              required
            />
          </InputGroup>
        </FormGroup>

        {/* pick up time */}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Pick up Time</InputGroupText>
            </InputGroupAddon>
            <TimePicker
              showSecond={false}
              defaultValue={moment()}
              onChange={(value) => setPickUpTime(value)}
              value={pickUpTime}
            />
          </InputGroup>
        </FormGroup>

        {/*  Pick up location */}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Pick Up Location</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder='Location'
              type="text"
              value={pickUpLocation}
              onChange={(e) => {
                setSuccessFeedback('');
                setError('');
                setPickUpLocation(e.target.value);
              }}
              required
            />
          </InputGroup>
        </FormGroup>

        {/*  dropzone */}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Additional documations</InputGroupText>
            </InputGroupAddon>
            <div ref={carHireDropzoneNode} id='cadHireDiv' className='dropzone'></div>
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

CarHireSpecifications.propTypes = {
  setSuccessFeedback: PropTypes.func,
  setError: PropTypes.func,
  typeOfCar: PropTypes.string,
  setTypeOfCar: PropTypes.func,
  districtsToBeVisited: PropTypes.text,
  setDistrictsToBeVisited: PropTypes.func,
  numberOfCars: PropTypes.number,
  setNumberOfCars: PropTypes.func,
  numberOfDays: PropTypes.number,
  setNumberOfDays: PropTypes.func,
  numberOfNights: PropTypes.number,
  setNumberOfNights: PropTypes.func,
  pickUpTime: PropTypes.string,
  setPickUpTime: PropTypes.func,
  pickUpLocation: PropTypes.string,
  setPickUpLocation: PropTypes.func,
  carHireDatesRange: PropTypes.object,
  setcarHireDatesRange: PropTypes.func,
  setCurrentComponent: PropTypes.func,
  activeSections: PropTypes.array,
  currentComponent: PropTypes.array,
};

export default CarHireSpecifications;
