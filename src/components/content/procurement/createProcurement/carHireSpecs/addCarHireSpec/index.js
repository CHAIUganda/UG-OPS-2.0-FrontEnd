/* eslint-disable no-restricted-globals */
import React, { useState } from 'react';
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
import { IoMdAdd, IoMdSettings } from 'react-icons/io';
import { IconContext } from 'react-icons';
import TimePicker from 'rc-time-picker';
import moment from 'moment';

import DropzoneComponent from '../../../../../common/dropzone';

const AddCarHireSpec = ({
  addSpec,
  editSpec,
  position,
  edit,
  specToEdit,
}) => {
  const [success, setSuccess] = useState('');
  const [err, setErr] = useState('');
  const [modal, setModal] = useState(false);
  const [carDatesRangeErr, setCarDatesRangeErr] = useState('');
  const [specTitleErr, setSpecTitleErr] = useState('');
  const [typeOfCarErr, setTypeOfCarErr] = useState('');
  const [maxPriceError, setmaxPriceError] = useState('');
  const [minPriceError, setMinimumPriceError] = useState('');
  const [accountCodeErr, setAccountCodeErr] = useState('');
  const [districtsToBeVisitedErrr, setDistrictsToBeVisitedErr] = useState('');
  const [numberOfCarsErr, setNumberOfCarsErr] = useState('');
  const [numberOfDaysErr, setNumberOfDaysErr] = useState('');
  const [numberOfNightsErr, setNumberOfNightsErr] = useState('');
  const [pickUpLocationErr, setPickupLocationErr] = useState('');
  const [pickUpTimeErr, setPickUpTimeErr] = useState('');

  const [additionalDocumentations, setAdditionalDocumentations] = useState(
    edit ? specToEdit.additionalDocumentations : []
  );

  let filesHolder = edit ? specToEdit.additionalDocumentations : [];

  const [pickUpTime, setPickUpTime] = useState(
    edit ? specToEdit.pickUpTime : null
  );

  const [pickUpLocation, setPickUpLocation] = useState(
    edit ? specToEdit.pickUpLocation : ''
  );

  const [numberOfNights, setNumberOfNights] = useState(
    edit ? specToEdit.numberOfNights : '0'
  );

  const [numberOfDays, setNumberOfDays] = useState(
    edit ? specToEdit.numberOfDays : '0'
  );

  const [numberOfCars, setNumberOfCars] = useState(
    edit ? specToEdit.numberOfCars : '0'
  );

  const [districtsToBeVisited, setDistrictsToBeVisited] = useState(
    edit ? specToEdit.districtsToBeVisited : ''
  );

  const [accountCode, setAccountCode] = useState(
    edit ? specToEdit.accountCode : ''
  );

  const [maxPrice, setMaxPrice] = useState(
    edit ? specToEdit.maxPrice : '0'
  );

  const [minPrice, setMinPrice] = useState(
    edit ? specToEdit.minPrice : '0'
  );

  const [typeOfCar, setTypeOfCar] = useState(
    edit ? specToEdit.typeOfCar : ''
  );

  const [specTitle, setSpecTitle] = useState(
    edit ? specToEdit.specTitle : ''
  );

  const [carDatesRange, setCarDatesRange] = useState(
    edit ? specToEdit.carDatesRange : null
  );

  const toggle = () => {
    setModal(!modal);
  };

  const resetFilesArrays = () => {
    filesHolder = [];
    setAdditionalDocumentations(filesHolder);
  };

  const reset = () => {
    setCarDatesRange(null);
    setSpecTitle('');
    setTypeOfCar('');
    setMinPrice('0');
    setMaxPrice('0');
    setAccountCode('');
    setDistrictsToBeVisited('');
    setNumberOfCars('0');
    setNumberOfDays('0');
    setNumberOfNights('0');
    setPickUpLocation('');
    setPickUpTime(null);

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
      setmaxPriceError('Enter a valid number.');
      addEntry = false;
    }

    if (edit && !maxPrice) {
      setMinimumPriceError('Enter a valid number.');
      setErr('Enter a valid number  for minimum price.');
      addEntry = false;
    }

    if (isNaN(maxPrice)) {
      setErr('Enter a valid decimal number for maximum price.');
      setmaxPriceError('Enter a valid decimal number.');
      addEntry = false;
    }

    if (parseFloat(maxPrice) < 1) {
      setErr('Set a maximum price higher than 1.');
      setmaxPriceError('Set a maximum price higher than 1.');
      addEntry = false;
    }

    if (parseFloat(maxPrice) < parseFloat(minPrice)) {
      setErr('Set a maximum price higher than the minimum price.');
      setmaxPriceError('Set a maximum price higher the minimum price.');
      addEntry = false;
    }

    if (!carDatesRange) {
      setErr('Select a range of dates.');
      setCarDatesRangeErr('Select a range of dates.');
      addEntry = false;
    }

    if (specTitle.trim().length < 1) {
      setErr('Set a specification title.');
      setSpecTitleErr('Set a specification title.');
      addEntry = false;
    }

    if (typeOfCar.trim().length < 1) {
      setErr('Specify the type of car.');
      setTypeOfCarErr('Specify the type of car.');
      addEntry = false;
    }

    if (accountCode.trim().length < 1) {
      setErr('Select an account code.');
      setAccountCodeErr('Select an account code.');
      addEntry = false;
    }

    if (districtsToBeVisited.trim() < 1) {
      setErr('Enter at least a district to visit.');
      setDistrictsToBeVisitedErr('Enter at least a district to visit.');
      addEntry = false;
    }

    if (!edit && (!numberOfCars || !numberOfCars.trim())) {
      setNumberOfCarsErr('Enter a valid number.');
      setErr('Enter a valid number  for number of cars.');
      addEntry = false;
    }

    if (edit && !numberOfCars) {
      setNumberOfCarsErr('Enter a valid number.');
      setErr('Enter a valid for number of cars.');
      addEntry = false;
    }

    if (isNaN(numberOfCars)) {
      setNumberOfCarsErr('Enter a valid decimal number.');
      setErr('Enter a valid decimal for number of cars.');
      addEntry = false;
    }

    if (parseFloat(numberOfCars) <= 0) {
      setErr('Set a number of cars higher than 0.');
      setNumberOfCarsErr('Set a number of cars higher than 0.');
      addEntry = false;
    }

    if (!edit && (!numberOfDays || !numberOfDays.trim())) {
      setNumberOfDaysErr('Enter a valid number.');
      setErr('Enter a valid number  for number of days.');
      addEntry = false;
    }

    if (edit && !numberOfDays) {
      setNumberOfDaysErr('Enter a valid number.');
      setErr('Enter a valid for number of days.');
      addEntry = false;
    }

    if (isNaN(numberOfDays)) {
      setNumberOfDaysErr('Enter a valid decimal number.');
      setErr('Enter a valid decimal for number of days.');
      addEntry = false;
    }

    if (parseFloat(numberOfDays) <= 0) {
      setErr('Set a number of days higher than 0.');
      setNumberOfDaysErr('Set a number of days higher than 0.');
      addEntry = false;
    }

    if (!edit && (!numberOfNights || !numberOfNights.trim())) {
      setNumberOfNightsErr('Enter a valid number.');
      setErr('Enter a valid number  for number of nights.');
      addEntry = false;
    }

    if (edit && parseFloat(numberOfNights) < 0) {
      setNumberOfNightsErr('Enter a valid number.');
      setErr('Enter a valid for number of nights.');
      addEntry = false;
    }

    if (isNaN(numberOfNights)) {
      setNumberOfNightsErr('Enter a valid decimal number.');
      setErr('Enter a valid decimal for number of nights.');
      addEntry = false;
    }

    if (pickUpLocation.trim().length < 1) {
      setErr('Set a pick up location.');
      setPickupLocationErr('Set a pick up location.');
      addEntry = false;
    }

    if (!pickUpTime) {
      setErr('Set a pickup Time.');
      setPickUpTimeErr('Set a pickup Time.');
    }

    const newSpec = {
      specTitle: specTitle.trim(),
      minPrice: parseFloat(minPrice),
      maxPrice: parseFloat(maxPrice),
      additionalDocumentations,
      typeOfCar: typeOfCar.trim(),
      accountCode: accountCode.trim(),
      districtsToBeVisited: districtsToBeVisited.trim(),
      numberOfCars: parseFloat(numberOfCars),
      numberOfDays: parseFloat(numberOfDays),
      numberOfNights: parseFloat(numberOfNights),
      pickUpLocation: pickUpLocation.trim(),
      pickUpTime,
      carDatesRange
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

  const typeOfCarInput = () => {
    if (typeOfCarErr) {
      return (
        <>
          {/*  Type of car. */}
          <FormGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>Type Of Car</InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder='Type Of Car'
                type="text"
                value={typeOfCar}
                onChange={(e) => {
                  setSuccess('');
                  setErr('');
                  setTypeOfCarErr('');
                  setTypeOfCar(e.target.value);
                }}
                invalid
              />
              <FormFeedback>{typeOfCarErr}</FormFeedback>
            </InputGroup>
          </FormGroup>
        </>
      );
    }
    return (
      <>
        {/*  Type of car. */}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Type Of Car</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder='Type Of Car'
              type="text"
              value={typeOfCar}
              onChange={(e) => {
                setSuccess('');
                setErr('');
                setTypeOfCarErr('');
                setTypeOfCar(e.target.value);
              }}
            />
          </InputGroup>
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
            />
          </InputGroup>
          <FormText>A general title to differentiate specifications.</FormText>
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
              value={carDatesRange}
              selectRange={true}
              onChange={(date) => {
                setSuccess('');
                setErr('');
                setCarDatesRangeErr('');
                setCarDatesRange(date);
              }
              } />
          </InputGroup>
          {
            carDatesRangeErr
              ? <div className="alert alert-danger" role="alert">
                {carDatesRangeErr}
              </div>
              : <></>
          }
        </FormGroup>
      </>
    );
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
    if (maxPriceError) {
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
                  setmaxPriceError('');
                  setMaxPrice(e.target.value);
                }}
                invalid
              />
              <FormFeedback>{maxPriceError}</FormFeedback>
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
                setmaxPriceError('');
                setMaxPrice(e.target.value);
              }}
              required
            />
          </InputGroup>
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

  const districtsToBeVisitedInput = () => {
    if (districtsToBeVisitedErrr) {
      return (
        <>
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
                  setSuccess('');
                  setErr('');
                  setDistrictsToBeVisitedErr('');
                  setDistrictsToBeVisited(e.target.value);
                }}
                invalid
              />
              <FormFeedback>{districtsToBeVisitedErrr}</FormFeedback>
            </InputGroup>
            <FormText>Supply a comma seperated list of districts to be visited.</FormText>
          </FormGroup>
        </>
      );
    }
    return (
      <>
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
                setSuccess('');
                setErr('');
                setDistrictsToBeVisitedErr('');
                setDistrictsToBeVisited(e.target.value);
              }}
            />
          </InputGroup>
          <FormText>Supply a comma seperated list of districts to be visited.</FormText>
        </FormGroup>
      </>
    );
  };

  const numberOfCarsInput = () => {
    if (numberOfCarsErr) {
      return (
        <>
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
                  setSuccess('');
                  setErr('');
                  setNumberOfCarsErr('');
                  setNumberOfCars(e.target.value);
                }}
                invalid
              />
              <FormFeedback>{numberOfCarsErr}</FormFeedback>
            </InputGroup>
          </FormGroup>
        </>
      );
    }
    return (
      <>
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
                setSuccess('');
                setErr('');
                setNumberOfCarsErr('');
                setNumberOfCars(e.target.value);
              }}
            />
          </InputGroup>
        </FormGroup>
      </>
    );
  };

  const numberOfDaysInput = () => {
    if (numberOfDaysErr) {
      return (
        <>
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
                  setSuccess('');
                  setErr('');
                  setNumberOfDaysErr();
                  setNumberOfDays(e.target.value);
                }}
                invalid
              />
              <FormFeedback>{numberOfDaysErr}</FormFeedback>
            </InputGroup>
          </FormGroup>
        </>
      );
    }
    return (
      <>
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
                setSuccess('');
                setErr('');
                setNumberOfDaysErr('');
                setNumberOfDays(e.target.value);
              }}
            />
          </InputGroup>
        </FormGroup>
      </>
    );
  };

  const numberOfNightsInput = () => {
    if (numberOfNightsErr) {
      return (
        <>
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
                  setSuccess('');
                  setErr('');
                  setNumberOfNightsErr();
                  setNumberOfNights(e.target.value);
                }}
                invalid
              />
              <FormFeedback>{numberOfNightsErr}</FormFeedback>
            </InputGroup>
          </FormGroup>
        </>
      );
    }
    return (
      <>
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
                setSuccess('');
                setErr('');
                setNumberOfNightsErr('');
                setNumberOfNights(e.target.value);
              }}
            />
          </InputGroup>
        </FormGroup>
      </>
    );
  };

  const pickUpLocationInput = () => {
    if (pickUpLocationErr) {
      return (
        <>
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
                  setSuccess('');
                  setErr('');
                  setPickupLocationErr('');
                  setPickUpLocation(e.target.value);
                }}
                invalid
              />
              <FormFeedback>{pickUpLocationErr}</FormFeedback>
            </InputGroup>
          </FormGroup>
        </>
      );
    }
    return (
      <>
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
                setSuccess('');
                setErr('');
                setPickupLocationErr('');
                setPickUpLocation(e.target.value);
              }}
            />
          </InputGroup>
        </FormGroup>
      </>
    );
  };

  const pickUpTimeInput = () => {
    if (pickUpTimeErr) {
      return (
        <>
          {/* pick up time */}
          <FormGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>Pick up Time</InputGroupText>
              </InputGroupAddon>
              <TimePicker
                showSecond={false}
                defaultValue={moment()}
                onChange={(value) => {
                  setErr('');
                  setSuccess('');
                  setPickUpTimeErr('');
                  setPickUpTime(value);
                }}
                value={pickUpTime}
              />
            </InputGroup>
            <div className="alert alert-danger" role="alert">
              {pickUpTimeErr}
            </div>
          </FormGroup>
        </>
      );
    }
    return (
      <>
        {/* pick up time */}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Pick up Time</InputGroupText>
            </InputGroupAddon>
            <TimePicker
              showSecond={false}
              defaultValue={moment()}
              onChange={(value) => {
                setErr('');
                setSuccess('');
                setPickUpTimeErr('');
                setPickUpTime(value);
              }}
              value={pickUpTime}
            />
          </InputGroup>
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
        <ModalHeader toggle={toggle}>Car Hire Specifications</ModalHeader>
        <ModalBody>
          <Form>
            {err && <div className="errorFeedback m-2"> {err} </div>}
            {success && <div className="errorFeedback m-2"> {success} </div>}
            {specTitleInput()}
            <h6>Price range of procurement</h6>
            {minPriceInput()}
            {maxPriceInput()}
            {accountCodeInput()}
            {rangeOfDatesInput()}
            <h6>Duration Of Trip</h6>
            {numberOfDaysInput()}
            {numberOfNightsInput()}
            {typeOfCarInput()}
            {numberOfCarsInput()}
            {districtsToBeVisitedInput()}
            {pickUpLocationInput()}
            {pickUpTimeInput()}
            {dropzoneInput()}
            {err && <div className="errorFeedback m-2"> {err} </div>}
            {success && <div className="errorFeedback m-2"> {success} </div>}
            <div>
              {submitButtonText()}
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

AddCarHireSpec.propTypes = {
  edit: PropTypes.bool,
  specToEdit: PropTypes.object,
  addSpec: PropTypes.func,
  editSpec: PropTypes.func,
  position: PropTypes.number,
  x: PropTypes.array
};

export default AddCarHireSpec;
