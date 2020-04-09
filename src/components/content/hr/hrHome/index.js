import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

import CommonSpinner from '../../../common/spinner';
import { BASE_URL } from '../../../../config';

const mapStateToProps = (state) => ({
  token: state.auth.token,
  email: state.auth.email,
  gender: state.auth.gender,
  type: state.auth.type
});

function HRHome({
  token,
  email,
  gender,
  type
}) {
  const [spinner, setSpinner] = useState(false);
  const [error, setError] = useState('');
  const [leaveBalances, setLeaveBalances] = useState(false);

  useEffect(() => {
    setSpinner(true);
    setError('');
    axios.defaults.headers.common = { token };
    const endPoint = `${BASE_URL}leaveApi/getStaffLeavesTaken/${email}`;
    axios.get(endPoint)
      .then((res) => {
        setLeaveBalances(res.data.leaveDetails);
        setSpinner(false);
      })
      .catch((err) => {
        setSpinner(false);
        if (err && err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      });
  }, []);

  if (error) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        <p>{error}</p>
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

  const returnData = () => (
    <table className="table holidaysTable">
      <thead>
        <tr>
          <th scope="col">Leave Type</th>
          <th scope="col">Used</th>
          <th scope="col">Balance</th>
          <th scope="col" className="text-left">Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Annual Leave</td>
          <td>{leaveBalances.annualLeaveTaken}</td>
          <td>{leaveBalances.annualLeaveBal}</td>
          <td className="text-left">You accrue 1.75 annual leave days per month</td>
        </tr>
        {
          (type === 'expat' || type === 'tcn')
          && <tr>
            <td>Home Leave</td>
            <td>{leaveBalances.homeLeaveTaken}</td>
            {
              leaveBalances.homeLeaveTaken === 0
              && <td>
                {leaveBalances.homeLeaveBal}
              </td>
            }
            {
              leaveBalances.homeLeaveTaken > 0
              && <td>0</td>
            }
            <td className="text-left">You can take Home leave off of your annual leave once a year</td>
          </tr>
        }
        {
          (gender === 'Female' || gender === 'female')
          && <tr>
            <td>Maternity</td>
            <td>{leaveBalances.maternityLeaveTaken}</td>
            <td>{leaveBalances.maternityLeaveBal}</td>
            <td className="text-left" >
              You are entitled to 60 days of maternity leave days
            </td>
          </tr>
        }
        {
          (gender === 'Male' || gender === 'male')
          && <tr>
            <td>Paternity</td>
            <td>{leaveBalances.paternityLeaveTaken}</td>
            <td>-</td>
            <td className="text-left">You are entitled to 7 paternity leave days per occurence</td>
          </tr>
        }
        <tr>
          <td>Sick Leave</td>
          <td>{leaveBalances.sickLeaveTaken}</td>
          <td>{leaveBalances.sickLeaveBal}</td>
          <td className="text-left">
            You are entitled to 42 sick leave days.
            More than 3 days will require a doctor&apos;s note
          </td>
        </tr>
        <tr>
          <td>Study Leave</td>
          <td>{leaveBalances.studyLeaveTaken}</td>
          <td>{leaveBalances.studyLeaveBal}</td>
          <td className="text-left">You are entitled to 4 study leave days</td>
        </tr>
        <tr>
          <td>Unpaid Leave</td>
          <td>{leaveBalances.unPaidLeaveTaken}</td>
          <td>{leaveBalances.unpaidLeaveBal}</td>
          <td className="text-left">
            You can have up to 60 unpaid leave days.
            You should have exhausted all other leave entitlements
          </td>
        </tr>
      </tbody>
    </table>
  );

  if (!leaveBalances) {
    return <h5>Loading... </h5>;
  }

  return (
    <div>
      <h3>Your Leave Balances</h3>
      {returnData() }
    </div>
  );
}

HRHome.propTypes = {
  token: PropTypes.string,
  email: PropTypes.string,
  gender: PropTypes.string,
  type: PropTypes.string,
};

export default connect(mapStateToProps)(HRHome);
