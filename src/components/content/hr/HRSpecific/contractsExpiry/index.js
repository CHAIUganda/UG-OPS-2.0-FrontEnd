import React, { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';

import { BASE_URL } from '../../../../../config';
import SpecificContractModal from './specificContractModal';

const mapStateToProps = (state) => ({
  token: state.auth.token
});

function ContractsExpiry({ token }) {
  const [tableSpinner, setTableSpinner] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    setTableSpinner(true);
    const endPoint = `${BASE_URL}hrApi/getUsersContracts/90`;
    axios.defaults.headers.common = { token };
    axios.get(endPoint)
      .then((res) => {
        setTableSpinner(false);
        setContracts(res.data);
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
          contracts.map((contract, index) => (
            <tr key={contract._id}>
              <td>{ index + 1 }</td>
              <td>{`${contract.fName} ${contract.lName}`}</td>
              <td>{contract.programShortForm}</td>
              <td>{`${contract.programManagerDetails.fName} ${contract.programManagerDetails.lName}`}</td>
              <td>{`${contract.daysLeftonContract} days`}</td>
              <td>
                <SpecificContractModal
                  contract={contract}
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
      <h1>Expiring Contracts</h1>
      {returnTable()}
    </div>
  );
}

ContractsExpiry.propTypes = {
  token: PropTypes.string
};

export default connect(mapStateToProps)(ContractsExpiry);
