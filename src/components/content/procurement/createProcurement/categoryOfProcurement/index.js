import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  CustomInput,
} from 'reactstrap';

const CategoryOfProcurement = ({
  printing,
  setSuccessFeedback,
  setError,
  setPrinting,
  carHire,
  setCarHire,
  conferenceFacilities,
  setConferenceFacilities,
  stationery,
  setStationery,
  dataCollectors,
  setDataCollectors,
  accomodation,
  setAccomodation,
  medicalEquipment,
  setMedicalEquipment,
  computersAndAccessories,
  setComputersAndAccessories,
  other,
  setOther,
  describeOther,
  setDescribeOther
}) => (
  <>
    <h3>Category Of Procurement</h3>
    {/*  Printing */}
    <FormGroup>
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Printing</InputGroupText>
        </InputGroupAddon>
        <div className="intSwitch">
          <CustomInput
            type="switch"
            id="printingSwitch"
            name="customSwitch"
            checked={printing}
            onChange={(e) => {
              setSuccessFeedback('');
              setError('');
              setPrinting(e.target.checked);
            }}
          />
        </div>
      </InputGroup>
    </FormGroup>

    {/*  car hire */}
    <FormGroup>
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Car Hire</InputGroupText>
        </InputGroupAddon>
        <div className="intSwitch">
          <CustomInput
            type="switch"
            id="carHireSwitch"
            name="customSwitch"
            checked={carHire}
            onChange={(e) => {
              setSuccessFeedback('');
              setError('');
              setCarHire(e.target.checked);
            }}
          />
        </div>
      </InputGroup>
    </FormGroup>

    {/*  conference facilities */}
    <FormGroup>
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Conference Facilities</InputGroupText>
        </InputGroupAddon>
        <div className="intSwitch">
          <CustomInput
            type="switch"
            id="ConferenceFacilitiesSwitch"
            name="customSwitch"
            checked={conferenceFacilities}
            onChange={(e) => {
              setSuccessFeedback('');
              setError('');
              setConferenceFacilities(e.target.checked);
            }}
          />
        </div>
      </InputGroup>
    </FormGroup>

    {/* Stationery */}
    <FormGroup>
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Stationery</InputGroupText>
        </InputGroupAddon>
        <div className="intSwitch">
          <CustomInput
            type="switch"
            id="StationerySwitch"
            name="customSwitch"
            checked={stationery}
            onChange={(e) => {
              setSuccessFeedback('');
              setError('');
              setStationery(e.target.checked);
            }}
          />
        </div>
      </InputGroup>
    </FormGroup>

    {/* Data Collectors */}
    <FormGroup>
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Data Collectors</InputGroupText>
        </InputGroupAddon>
        <div className="intSwitch">
          <CustomInput
            type="switch"
            id="DataCollectorsSwitch"
            name="customSwitch"
            checked={dataCollectors}
            onChange={(e) => {
              setSuccessFeedback('');
              setError('');
              setDataCollectors(e.target.checked);
            }}
          />
        </div>
      </InputGroup>
    </FormGroup>

    {/* Accomodation */}
    <FormGroup>
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Accomodation</InputGroupText>
        </InputGroupAddon>
        <div className="intSwitch">
          <CustomInput
            type="switch"
            id="AccomodationSwitch"
            name="customSwitch"
            checked={accomodation}
            onChange={(e) => {
              setSuccessFeedback('');
              setError('');
              setAccomodation(e.target.checked);
            }}
          />
        </div>
      </InputGroup>
    </FormGroup>

    {/* Medical equipment */}
    <FormGroup>
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Medical Equipment</InputGroupText>
        </InputGroupAddon>
        <div className="intSwitch">
          <CustomInput
            type="switch"
            id="MedicalEquipmentSwitch"
            name="customSwitch"
            checked={medicalEquipment}
            onChange={(e) => {
              setSuccessFeedback('');
              setError('');
              setMedicalEquipment(e.target.checked);
            }}
          />
        </div>
      </InputGroup>
    </FormGroup>

    {/* Computers & Accessories */}
    <FormGroup>
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Computers And Accessories</InputGroupText>
        </InputGroupAddon>
        <div className="intSwitch">
          <CustomInput
            type="switch"
            id="ComputersAndAccessoriesSwitch"
            name="customSwitch"
            checked={computersAndAccessories}
            onChange={(e) => {
              setSuccessFeedback('');
              setError('');
              setComputersAndAccessories(e.target.checked);
            }}
          />
        </div>
      </InputGroup>
    </FormGroup>

    {/* Other */}
    <FormGroup>
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Other</InputGroupText>
        </InputGroupAddon>
        <div className="intSwitch">
          <CustomInput
            type="switch"
            id="otherSwitch"
            name="customSwitch"
            checked={other}
            onChange={(e) => {
              setSuccessFeedback('');
              setError('');
              setOther(e.target.checked);
            }}
          />
        </div>
      </InputGroup>
    </FormGroup>

    {
      other
  && <FormGroup>
    <InputGroup>
      <InputGroupAddon addonType="prepend">
        <InputGroupText>Description of Other</InputGroupText>
      </InputGroupAddon>
      <Input
        placeholder="Describe other"
        type="text"
        value={describeOther}
        onChange={(e) => {
          setSuccessFeedback('');
          setError('');
          setDescribeOther(e.target.value);
        }}
        required
      />
    </InputGroup>
  </FormGroup>
    }
  </>
);

CategoryOfProcurement.propTypes = {
  printing: PropTypes.bool,
  setSuccessFeedback: PropTypes.func,
  setError: PropTypes.func,
  setPrinting: PropTypes.func,
  carHire: PropTypes.bool,
  setCarHire: PropTypes.func,
  conferenceFacilities: PropTypes.bool,
  setConferenceFacilities: PropTypes.func,
  stationery: PropTypes.bool,
  setStationery: PropTypes.func,
  dataCollectors: PropTypes.bool,
  setDataCollectors: PropTypes.func,
  accomodation: PropTypes.bool,
  setAccomodation: PropTypes.func,
  medicalEquipment: PropTypes.bool,
  setMedicalEquipment: PropTypes.func,
  computersAndAccessories: PropTypes.bool,
  setComputersAndAccessories: PropTypes.func,
  other: PropTypes.bool,
  setOther: PropTypes.func,
  describeOther: PropTypes.string,
  setDescribeOther: PropTypes.func
};

export default CategoryOfProcurement;
