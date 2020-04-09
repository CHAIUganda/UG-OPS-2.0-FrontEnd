import React, { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';

import { BASE_URL } from '../../../../../config';
import SpecificContractModal from './specificWorkPermitModal';

const mapStateToProps = (state) => ({
  token: state.auth.token
});

function WorkPermitsExpiry({ token }) {
  const [tableSpinner, setTableSpinner] = useState(false);
  const [workPermits, setWorkPermits] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    setTableSpinner(true);
    const endPoint = `${BASE_URL}hrApi/getUsersWorkPermits/90`;
    axios.defaults.headers.common = { token };
    axios.get(endPoint)
      .then((res) => {
        setTableSpinner(false);
        setWorkPermits(res.data);
      })
      .catch((err) => {
        setTableSpinner(false);
        if (err && err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      });
  }, []);

  if (tableSpinner) {
    return (
      <>
        <h6>Please wait... </h6>
        <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
      </>
    );
  }

  if (error) {
    return <div className="errorFeedback">{ error }</div>;
  }

  const returnTable = () => (
    <table className="table holidaysTable">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Program</th>
          <th scope="col">Program Manager</th>
          <th scope="col">Time to Expiry</th>
        </tr>
      </thead>
      <tbody>
        {
          workPermits.map((workPermit, index) => (
            <tr key={workPermit._id}>
              <td>{ index + 1 }</td>
              <td>{`${workPermit.fName} ${workPermit.lName}`}</td>
              <td>{workPermit.programShortForm}</td>
              <td>{`${workPermit.programManagerDetails.fName} ${workPermit.programManagerDetails.lName}`}</td>
              <td>{`${workPermit.daysLeftonWorkPermit} days`}</td>
              <td>
                <SpecificContractModal
                  workPermit={workPermit}
                />
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );
  return (
    <div>
      <h1>Expiring Work Permits</h1>
      {returnTable()}
    </div>
  );
}

WorkPermitsExpiry.propTypes = {
  token: PropTypes.string
};

export default connect(mapStateToProps)(WorkPermitsExpiry);