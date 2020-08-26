import React, { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import * as sideBarActions from '../../../../../redux/actions/sideBarActions';
import * as authActions from '../../../../../redux/actions/authActions';

import { BASE_URL } from '../../../../../config';
import SpecificContractModal from './specificContractModal';

const matchDispatchToProps = {
  changeSection: sideBarActions.changeSection,
  changeActive: sideBarActions.changeActive,
  logUserOut: authActions.logUserOut
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
  roles: state.auth.roles
});

function ContractsExpiry({
  token,
  roles,
  changeSection,
  changeActive,
  logUserOut
}) {
  const [tableSpinner, setTableSpinner] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [error, setError] = useState('');

  if (token && roles) {
    if (!roles.hr && !roles.admin) {
      return (
        <div className="alert alert-danger text-center" role="alert">
          <p>{'FE: You have no access rights for this resource.'}</p>
        </div>
      );
    }
  }

  changeSection('Human Resource');
  changeActive('ContractsExpiry');

  const setUpThisPage = () => {
    const endPoint = `${BASE_URL}hrApi/getUsersContracts/90`;
    axios.defaults.headers.common = { token };
    axios.get(endPoint)
      .then((res) => {
        setTableSpinner(false);
        setContracts(res.data);
      })
      .catch((err) => {
        setTableSpinner(false);

        if (err && err.response && err.response.status && err.response.status === 401) {
          Cookies.remove('token');
          logUserOut();
        }

        if (err && err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      });
  };

  useEffect(() => {
    setTableSpinner(true);
    setError('');

    if (token) {
      setUpThisPage();
    } else {
      Cookies.remove('token');
      logUserOut();
    }
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

  const modifyContractsList = (index) => {
    const arr = [...contracts];
    arr.splice(index, 1);
    setContracts(arr);
  };

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
              <td>
                {
                  (contract && contract.programManagerDetails)
                    ? `${contract.programManagerDetails.fName} ${contract.programManagerDetails.lName}`
                    : '_'
                }
              </td>
              <td>{`${contract.daysLeftonContract} days`}</td>
              <td>
                <SpecificContractModal
                  contract={contract}
                  token={token}
                  BASE_URL={BASE_URL}
                  modifyContractsList={modifyContractsList}
                  index={index}
                  logUserOut={logUserOut}
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
  token: PropTypes.string,
  roles: PropTypes.object,
  changeSection: PropTypes.func,
  changeActive: PropTypes.func,
  logUserOut: PropTypes.func,
};

export default connect(mapStateToProps, matchDispatchToProps)(ContractsExpiry);
