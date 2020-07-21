import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form } from 'reactstrap';

import * as sideBarActions from '../../../../redux/actions/sideBarActions';
import CommonSpinner from '../../../common/spinner';
import ProcurementInitialDetails from './procurementInitialDetails';
import CategoryOfProcurement from './categoryOfProcurement';
import GeneralDetails from './generalProcurementDetails';
import PrintingSpecs from './printingSpecs';
import FinishCreateProcurement from './finish';
import CarHireSpecifications from './carHireSpecs';
// import StationarySpecs from './stationarySpecs';

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
  const [currentComponent, setCurrentComponent] = useState([ProcurementInitialDetails]);
  const [activeSections, setActiveSections] = useState([
    ProcurementInitialDetails,
    CategoryOfProcurement,
    GeneralDetails
  ]);
  const [gid, setGid] = useState('');
  const [pids, setPids] = useState([]);
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
  const [keyObjectiveAsPerCostedWorkPlan, setKeyObjectiveAsPerCostedWorkPlan] = useState('');
  const [keyActivitiesAsPerCostedWorkPlan, setKeyActivitiesAsPerCostedWorkPlan] = useState('');
  const [printingSpecs, setPrintingSpecs] = useState([]);
  const [carHireSpecs, setCarHireSpecs] = useState([]);
  // const [itemRequests, setItemRequests] = useState('');
  // const [quantitiesRequired, setQuantitiesRequired] = useState('');
  // const [describeItems, setDescribeItems] = useState('');

  changeSection('Procurement');
  changeActive('CreateProcurement');

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const returnComponent = () => {
    if (currentComponent[0] === 'finish') {
      return <FinishCreateProcurement
        setCurrentComponent={setCurrentComponent}
        activeSections={activeSections}
        currentComponent={currentComponent}
      />;
    }

    if (currentComponent[0] === ProcurementInitialDetails) {
      return (
        <ProcurementInitialDetails
          setSuccessFeedback={setSuccessFeedback}
          setError={setError}
          setGid={setGid}
          gid={gid}
          pids={pids}
          setPids={setPids}
          objectiveCode={objectiveCode}
          setObjectiveCode={setObjectiveCode}
          setCurrentComponent={setCurrentComponent}
          activeSections={activeSections}
          setActiveSections={setActiveSections}
          currentComponent={currentComponent}
        />
      );
    }

    if (currentComponent[0] === CategoryOfProcurement) {
      return (
        <CategoryOfProcurement
          error={error}
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
          setCurrentComponent={setCurrentComponent}
          activeSections={activeSections}
          setActiveSections={setActiveSections}
          currentComponent={currentComponent}

        />
      );
    }

    if (currentComponent[0] === GeneralDetails) {
      return (
        <GeneralDetails
          setSuccessFeedback={setSuccessFeedback}
          setError={setError}
          keyObjectiveAsPerCostedWorkPlan={keyObjectiveAsPerCostedWorkPlan}
          setKeyObjectiveAsPerCostedWorkPlan={setKeyObjectiveAsPerCostedWorkPlan}
          keyActivitiesAsPerCostedWorkPlan={keyActivitiesAsPerCostedWorkPlan}
          setKeyActivitiesAsPerCostedWorkPlan={setKeyActivitiesAsPerCostedWorkPlan}
          setCurrentComponent={setCurrentComponent}
          activeSections={activeSections}
          currentComponent={currentComponent}
        />
      );
    }

    if (currentComponent[0] === PrintingSpecs) {
      return (
        <PrintingSpecs
          setSuccessFeedback={setSuccessFeedback}
          setCurrentComponent={setCurrentComponent}
          activeSections={activeSections}
          currentComponent={currentComponent}
          printingSpecs={printingSpecs}
          setPrintingSpecs={setPrintingSpecs}
        />
      );
    }

    if (currentComponent[0] === CarHireSpecifications) {
      return (
        <CarHireSpecifications
          setCurrentComponent={setCurrentComponent}
          activeSections={activeSections}
          currentComponent={currentComponent}
          carHireSpecs={carHireSpecs}
          setCarHireSpecs={setCarHireSpecs}
        />
      );
    }

    return <></>;
  };

  return (
    <div className='createProcformContainer containerPositionRelative'>
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
        {returnComponent()}
      </Form>
    </div>

  //     <StationarySpecs
  //       setError={setError}
  //       setSuccessFeedback={setSuccessFeedback}
  //       itemRequests={itemRequests}
  //       setItemRequests={setItemRequests}
  //       quantitiesRequired={quantitiesRequired}
  //       setQuantitiesRequired={setQuantitiesRequired}
  //       describeItems={describeItems}
  //       setDescribeItems={setDescribeItems}
  //     />

  //   </Form>
  // </div>
  );
}

CreateProcurement.propTypes = {
  token: PropTypes.string,
  email: PropTypes.string,
  changeSection: PropTypes.func,
  changeActive: PropTypes.func
};

export default connect(mapStateToProps, matchDispatchToProps)(CreateProcurement);
