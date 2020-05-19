import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form } from 'reactstrap';

import * as sideBarActions from '../../../../redux/actions/sideBarActions';
import CommonSpinner from '../../../common/spinner';
import ProcurementInitialDetails from './procurementInitialDetails';
import CategoryOfProcurement from './categoryOfProcurement';

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
