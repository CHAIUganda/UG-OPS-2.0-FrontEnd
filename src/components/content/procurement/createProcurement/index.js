import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form } from 'reactstrap';
// import { moment } from 'moment';

import * as sideBarActions from '../../../../redux/actions/sideBarActions';
import CommonSpinner from '../../../common/spinner';
import ProcurementInitialDetails from './procurementInitialDetails';
import CategoryOfProcurement from './categoryOfProcurement';
import GeneralDetails from './generalProcurementDetails';
import PrintingSpecs from './printingSpecs';
import CarHireSpecifications from './carHireSpecs';
import StationarySpecs from './stationarySpecs';

import './createProcurement.css';

const matchDispatchToProps = {
  changeSection: sideBarActions.changeSection,
  changeActive: sideBarActions.changeActive
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
  email: state.auth.email,
  gender: state.auth.gender,
  type: state.auth.type
});

function CreateProcurement({
  changeSection,
  changeActive
}) {
  /*
  Check for roles

  if (roles) {
    if (!roles.hr && !roles.admin) {
      return (
        <div className="alert alert-danger text-center" role="alert">
          <p>{'FE: You have no access rights for this resource.'}</p>
        </div>
      );
    }
  } else {
    return (
      <div className="alert alert-danger text-center" role="alert">
        <p>{'FE: You seem to have no roles.'}</p>
        <p>Please contact the system admin to rectify this.</p>
      </div>
    );
  }
  */

  const [spinner] = useState(false);
  const [error, setError] = useState('');
  const [successFeedback, setSuccessFeedback] = useState('');
  const [gid, setGid] = useState('');
  const [pid, setPid] = useState('');
  const [objectiveCode, setObjectiveCode] = useState('');
  const [printing, setPrinting] = useState(false);
  const [carHire, setCarHire] = useState(false);
  const [conferenceFacilities, setConferenceFacilities] = useState(false);
  const [stationery, setStationery] = useState(false);
  const [dataCollectors, setDataCollectors] = useState(false);
  const [accomodation, setAccomodation] = useState(false);
  const [medicalEquipment, setMedicalEquipment] = useState(false);
  const [computersAndAccessories, setComputersAndAccessories] = useState(false);
  const [other, setOther] = useState(false);
  const [describeOther, setDescribeOther] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [leaveDates, setLeaveDates] = useState();
  const [keyObjectiveAsPerCostedWorkPlan, setKeyObjectiveAsPerCostedWorkPlan] = useState('');
  const [keyActivitiesAsPerCostedWorkPlan, setKeyActivitiesAsPerCostedWorkPlan] = useState('');
  const [qualityToBePrinted, setQualityToBePrinted] = useState('');
  const [detailedDescriptionOfPrint, setDetailedDescriptionOfPrint] = useState('');
  const [moreDetails, setMoreDetails] = useState('');
  const [accountCode, setAccountCode] = useState('');
  const [sampleNeeded, setSampleNeeded] = useState('No');
  const [colourNeeded, setColourNeeded] = useState('Black/White');
  const [typeOfBinding, setTypeOfBinding] = useState('');
  const [typeOfPaper, setTypeOfPaper] = useState('');
  const [paperSize, setPaperSize] = useState('');
  const [typeOfCar, setTypeOfCar] = useState('');
  const [districtsToBeVisited, setDistrictsToBeVisited] = useState('');
  const [numberOfCars, setNumberOfCars] = useState(0);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [pickUpTime, setPickUpTime] = useState();
  const [pickUpLocation, setPickUpLocation] = useState('');
  const [itemRequests, setItemRequests] = useState('');
  const [quantitiesRequired, setQuantitiesRequired] = useState('');
  const [describeItems, setDescribeItems] = useState('');

  changeSection('Procurement');
  changeActive('CreateProcurement');

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className='createProcformContainer'>
      <Form onsubmit={handleSubmit}>
        {
          spinner
          && <div className="alert alert-info text-center" role="alert">
            <div><CommonSpinner /></div>
            <p>Getting things ready.....</p>
          </div>
        }
        {error && <div className="errorFeedback"> {error} </div>}
        {successFeedback && <div className="successFeedback"> {successFeedback} </div>}

        <ProcurementInitialDetails
          setSuccessFeedback={setSuccessFeedback}
          setError={setError}
          setGid={setGid}
          gid={gid}
          pid={pid}
          setPid={setPid}
          objectiveCode={objectiveCode}
          setObjectiveCode={setObjectiveCode}
        />

        <CategoryOfProcurement
          printing={printing}
          setSuccessFeedback={setSuccessFeedback}
          setError={setError}
          setPrinting={setPrinting}
          carHire={carHire}
          setCarHire={setCarHire}
          conferenceFacilities={conferenceFacilities}
          setConferenceFacilities={setConferenceFacilities}
          stationery={stationery}
          setStationery={setStationery}
          dataCollectors={dataCollectors}
          setDataCollectors={setDataCollectors}
          accomodation={accomodation}
          setAccomodation={setAccomodation}
          medicalEquipment={medicalEquipment}
          setMedicalEquipment={setMedicalEquipment}
          computersAndAccessories={computersAndAccessories}
          setComputersAndAccessories={setComputersAndAccessories}
          other={other}
          setOther={setOther}
          describeOther={describeOther}
          setDescribeOther={setDescribeOther}
        />

        <GeneralDetails
          setSuccessFeedback={setSuccessFeedback}
          setError={setError}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          leaveDates={leaveDates}
          setLeaveDates={setLeaveDates}
          keyObjectiveAsPerCostedWorkPlan={keyObjectiveAsPerCostedWorkPlan}
          setKeyObjectiveAsPerCostedWorkPlan={setKeyObjectiveAsPerCostedWorkPlan}
          keyActivitiesAsPerCostedWorkPlan={keyActivitiesAsPerCostedWorkPlan}
          setKeyActivitiesAsPerCostedWorkPlan={setKeyActivitiesAsPerCostedWorkPlan}
        />

        <PrintingSpecs
          setSuccessFeedback={setSuccessFeedback}
          setError={setError}
          qualityToBePrinted={qualityToBePrinted}
          setQualityToBePrinted={setQualityToBePrinted}
          detailedDescriptionOfPrint={detailedDescriptionOfPrint}
          setDetailedDescriptionOfPrint={setDetailedDescriptionOfPrint}
          moreDetails={moreDetails}
          setMoreDetails={setMoreDetails}
          accountCode={accountCode}
          setAccountCode={setAccountCode}
          sampleNeeded={sampleNeeded}
          setSampleNeeded={setSampleNeeded}
          colourNeeded={colourNeeded}
          setColourNeeded={setColourNeeded}
          typeOfBinding={typeOfBinding}
          setTypeOfBinding={setTypeOfBinding}
          typeOfPaper={typeOfPaper}
          setTypeOfPaper={setTypeOfPaper}
          paperSize={paperSize}
          setPaperSize={setPaperSize}
        />

        <CarHireSpecifications
          setSuccessFeedback={setSuccessFeedback}
          setError={setError}
          typeOfCar={typeOfCar}
          setTypeOfCar={setTypeOfCar}
          districtsToBeVisited={districtsToBeVisited}
          setDistrictsToBeVisited={setDistrictsToBeVisited}
          numberOfCars={numberOfCars}
          setNumberOfCars={setNumberOfCars}
          numberOfDays={numberOfDays}
          setNumberOfDays={setNumberOfDays}
          numberOfNights={numberOfNights}
          setNumberOfNights={setNumberOfNights}
          pickUpTime={pickUpTime}
          setPickUpTime={setPickUpTime}
          pickUpLocation={pickUpLocation}
          setPickUpLocation={setPickUpLocation}
        />

        <StationarySpecs
          setError={setError}
          setSuccessFeedback={setSuccessFeedback}
          itemRequests={itemRequests}
          setItemRequests={setItemRequests}
          quantitiesRequired={quantitiesRequired}
          setQuantitiesRequired={setQuantitiesRequired}
          describeItems={describeItems}
          setDescribeItems={setDescribeItems}
        />

      </Form>
    </div>
  );
}

CreateProcurement.propTypes = {
  token: PropTypes.string,
  email: PropTypes.string,
  changeSection: PropTypes.func,
  changeActive: PropTypes.func
};

export default connect(mapStateToProps, matchDispatchToProps)(CreateProcurement);
