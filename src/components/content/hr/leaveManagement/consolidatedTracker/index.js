import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import ReactToPrint from 'react-to-print';

import CommonSpinner from '../../../../common/spinner';
import { BASE_URL, returnStatusClass } from '../../../../../config';
import './consolidatedTracker.css';

const mapStateToProps = (state) => ({
  token: state.auth.token,
  email: state.auth.email,
  gender: state.auth.gender,
  type: state.auth.type
});

function ConsolidatedTracker({ token }) {
  const [spinner, setSpinner] = useState(false);
  const [error, setError] = useState('');
  const [/* allLeaves */, setallLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentControl, setCurrentControl] = useState(null);
  const [currentList, setCurrentList] = useState([]);

  const componentRef = useRef();

  useEffect(() => {
    setSpinner(true);
    setError('');
    axios.defaults.headers.common = { token };
    const endPoint = `${BASE_URL}leaveApi/getAllStaffLeaves/all/all`;
    axios.get(endPoint)
      .then((res) => {
        setallLeaves(res.data);
        setFilteredLeaves(res.data);
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

  const handleChange = (event, control) => {
    let array2Filter = [];
    if (control === 'typeFilter') {
      const { value } = event.target;
      if (currentControl !== control) {
        setCurrentControl(control);
        setCurrentList([...filteredLeaves]);
        array2Filter = [...filteredLeaves];
      } else {
        array2Filter = [...currentList];
      }

      setTypeFilter(value);
      if (value && value !== 'all') {
        const l = array2Filter.filter((leave) => leave.type === value);
        setFilteredLeaves(l);
      }
    }
  };

  const returnData = () => (
    <table className="table holidaysTable" id="hrConsolidatedTrackerTable" ref={componentRef}>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Program</th>
          <th scope="col">
            Type
            <select className="dropdownFilter" value={typeFilter} onChange={(e) => handleChange(e, 'typeFilter')}>
              <option value="all" className="optionTableStyle">all</option>
              <option value="Annual" className="optionTableStyle">Annual</option>
              <option value="Paternity" className="optionTableStyle">Paternity</option>
              <option value="Home" className="optionTableStyle">Home</option>
              <option value="Maternity" className="optionTableStyle">Maternity</option>
              <option value="Sick" className="optionTableStyle">Sick</option>
              <option value="Unpaid" className="optionTableStyle">Unpaid</option>
              <option value="Study" className="optionTableStyle">Study</option>
            </select>
          </th>
          <th scope="col">Status</th>
          <th scope="col">Rejection Reason</th>
          <th scope="col">Days</th>
          <th scope="col">Starts</th>
          <th scope="col">Ends</th>
          <th scope="col">Month</th>
        </tr>
      </thead>
      <tbody>
        {
          filteredLeaves.map((leave) => (
            <tr key={leave._id}>
              <td>{`${leave.staff.fName} ${leave.staff.lName}`}</td>
              <td>{leave.program}</td>
              <td>{leave.type}</td>
              <td>
                <button className={returnStatusClass(leave.status)}>
                  {leave.status}
                </button>
              </td>
              <td>{leave.rejectionReason ? leave.rejectionReason : '-'}</td>
              <td>{leave.daysTaken}</td>
              <td>{new Date(leave.startDate).toDateString()}</td>
              <td>{new Date(leave.endDate).toDateString()}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );

  return (
    <div className="row">
      <div className="col">
        <h3>
            Consolidated Leave Tracker
          <ReactToPrint
            trigger={() => <button type="button" className="btn btn-secondary float-right">
            Print Current Selection
            </button>}
            content={() => componentRef.current}
          />
        </h3>
        <div className="row">
          <div className="col">
            {returnData() }
          </div>
        </div>
      </div>
    </div>
  );
}

ConsolidatedTracker.propTypes = {
  token: PropTypes.string,
  email: PropTypes.string,
  gender: PropTypes.string,
  type: PropTypes.string,
};

export default connect(mapStateToProps)(ConsolidatedTracker);
