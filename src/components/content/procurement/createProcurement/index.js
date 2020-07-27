import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form } from 'reactstrap';
import { useOktaAuth } from '@okta/okta-react';
import axios from 'axios';

import { BASE_URL } from '../../../../config';

import * as sideBarActions from '../../../../redux/actions/sideBarActions';
import * as authActions from '../../../../redux/actions/authActions';
import * as notificationActions from '../../../../redux/actions/notificationsActions';

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
  changeActive: sideBarActions.changeActive,
  logUserIn: authActions.logUserIn,
  setInitialNotifications: notificationActions.setInitialNotifications
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
  email: state.auth.email,
  gender: state.auth.gender,
  type: state.auth.type,
  roles: state.auth.roles
});

function CreateProcurement({
  changeSection,
  changeActive,
  token,
  setInitialNotifications,
  logUserIn,
  roles
}) {
  // Check for roles

  if (token && roles) {
    if (!roles.operationsLead && !roles.admin) {
      return (
        <div className="alert alert-danger text-center" role="alert">
          <p>{'FE: You have no access rights for this resource.'}</p>
        </div>
      );
    }
  }

  const [error, setError] = useState('');
  const [loadingPageErr, setLoadingPageErr] = useState('');
  const [successFeedback, setSuccessFeedback] = useState('');
  const { authState, authService } = useOktaAuth();

  const [currentComponent, setCurrentComponent] = useState([ProcurementInitialDetails]);
  const [activeSections, setActiveSections] = useState([
    ProcurementInitialDetails,
    CategoryOfProcurement,
    GeneralDetails
  ]);
  const [gids, setGids] = useState([]);
  const [pids, setPids] = useState([]);
  const [objectiveCodes, setObjectiveCodes] = useState([]);
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

  const [spinner, setSpinner] = useState(false);

  changeSection('Procurement');
  changeActive('CreateProcurement');

  const setUpUser = (tokenToSet) => {
    axios.defaults.headers.common = { token: tokenToSet };
    const apiRoute = `${BASE_URL}auth/getLoggedInUser`;
    axios.get(apiRoute)
      . then((res) => {
        const {
          department,
          fName,
          internationalStaff,
          lName,
          position,
          _id,
          supervisorDetails,
          notifications
        } = res.data;
        const genderToSet = res.data.gender;
        const emailToSet = res.data.email;
        const leaveDetailsToSet = res.data.leaveDetails;

        const userObject = {
          ...res.data,
          email: emailToSet,
          token: tokenToSet,
          gender: genderToSet,
          internationalStaff,
          department,
          firstName: fName,
          lastName: lName,
          Position: position,
          id: _id,
          leaveDetails: leaveDetailsToSet,
          supervisor: supervisorDetails
        };
        setInitialNotifications(notifications);
        logUserIn(userObject);
        setSpinner(false);
      })
      .catch((err) => {
        setSpinner(false);

        if (err.response.status === 401) {
          authService.logout('/');
        }

        if (err && err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      });
  };

  const setUpThisPage = () => {
    // set this page up. Do stuff like pick pids and gids.
    setSpinner(false);
  };

  useEffect(() => {
    setSpinner(true);
    setLoadingPageErr('');

    if (token) {
      setUpThisPage();
    }

    if (!token && authState.isAuthenticated) {
      const { accessToken } = authState;
      setUpUser(`Bearer ${accessToken}`);
    }

    if (!token && !authState.isAuthenticated) {
      setSpinner(false);
      authService.logout('/');
    }
  }, []);

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
          setGids={setGids}
          gids={gids}
          pids={pids}
          setPids={setPids}
          objectiveCodes={objectiveCodes}
          setObjectiveCodes={setObjectiveCodes}
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

  if (loadingPageErr) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        <p>{loadingPageErr}</p>
      </div>
    );
  }

  if (spinner) {
    return (
      <div className="alert alert-info text-center" role="alert">
        <div>
          <CommonSpinner />
          <p>Getting things ready.....</p>
        </div>
      </div>
    );
  }

  return (
    <div className='createProcformContainer containerPositionRelative'>
      <Form onsubmit={handleSubmit}>
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
  changeActive: PropTypes.func,
  setInitialNotifications: PropTypes.func,
  logUserIn: PropTypes.func,
  roles: PropTypes.object
};

export default connect(mapStateToProps, matchDispatchToProps)(CreateProcurement);
