import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import html2canvas from 'html2canvas';
import JSPDF from 'jspdf';
import Select from 'react-select';
import moment from 'moment';

import CommonSpinner from '../../../../common/spinner';
import { BASE_URL, returnStatusClass } from '../../../../../config';
import './programTracker.css';

const mapStateToProps = (state) => ({
  token: state.auth.token,
  email: state.auth.email,
  gender: state.auth.gender,
  type: state.auth.type,
  program: state.auth.program
});

function ProgramLeaveTracker({ token, program }) {
  const [spinner, setSpinner] = useState(false);
  const [error, setError] = useState('');
  const [allLeaves, setallLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('all');
  const [endDate, setEndDate] = useState('all');
  const [allUsers, setAllUsers] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [name, setName] = useState('all');
  const [allFiltersState, setAllFiltersState] = useState(
    {
      status: 'all',
      startDate: 'all',
      endDate: 'all',
      name: 'all'
    }
  );

  let allFilters = {
    status: 'all',
    startDate: 'all',
    endDate: 'all',
    name: 'all'
  };

  const getUsers = () => {
    axios.defaults.headers.common = { token };
    const apiRoute = `${BASE_URL}auth/getUsers`;
    axios.get(apiRoute)
      . then((res) => {
        setSpinner(false);
        const filterByProgram = res.data.filter((user) => user.program === program);
        const arrayToSet = filterByProgram.map((user) => ({
          label: `${user.fName} ${user.lName}`,
          value: user.email
        }));
        setAllUsers([
          {
            label: 'all',
            value: 'all'
          },
          ...arrayToSet
        ]);
      })
      .catch((err) => {
        setSpinner(false);
        if (err && err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      });
  };

  useEffect(() => {
    setSpinner(true);
    setError('');
    axios.defaults.headers.common = { token };
    const endPoint = `${BASE_URL}leaveApi/getAllStaffLeaves/all/all`;
    axios.get(endPoint)
      .then((res) => {
        const sortByProgram = res.data.filter((l) => l.program === program && (l.status === 'Planned' || l.status === 'Approved' || l.status === 'Taken'));
        // eslint-disable-next-line max-len
        const sortForFutureDates = sortByProgram.filter((l) => moment(l.startDate).isSameOrAfter(new Date()) || moment(l.endDate).isSameOrAfter(new Date()));
        setallLeaves(sortForFutureDates);
        setFilteredLeaves(sortForFutureDates);
        getUsers();
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

  const filter = (filterObj) => {
    let array2Filter = [...allLeaves];
    Object.keys(filterObj).forEach((fil) => {
      if (filterObj[fil] === 'all') {
        if (fil === 'name' && filterObj.name === 'all') {
          array2Filter = array2Filter.filter((leave) => leave.staff);
        } else {
          array2Filter = array2Filter.filter((leave) => leave[fil]);
        }
      } else if (fil === 'startDate' || fil === 'endDate') {
        array2Filter = array2Filter.filter((leave) => `${new Date(leave[fil]).getMonth()}` === allFilters[fil]);
      } else if (fil === 'name' && filterObj.name === 'all') {
        array2Filter = array2Filter.filter((leave) => leave.staff);
      } else if (fil === 'name') {
        array2Filter = array2Filter.filter((leave) => `${leave.staff.fName} ${leave.staff.lName}` === allFilters.name);
      } else if (fil === 'status' && filterObj[fil] === 'On Leave') {
        array2Filter = array2Filter.filter((leave) => (leave.status === 'Approved' || leave.status === 'Taken'));
      } else {
        array2Filter = array2Filter.filter((leave) => leave[fil] === allFilters[fil]);
      }
    });
    setFilteredLeaves(array2Filter);
  };

  const handleChange = (event, stateSetter, filterParam) => {
    event.preventDefault();
    const { value } = event.target;
    stateSetter(value);
    allFilters = {
      ...allFiltersState,
      [filterParam]: value
    };
    setAllFiltersState(allFilters);
    filter(allFilters);
  };

  const resetFilters = () => {
    allFilters = {
      status: 'all',
      startDate: 'all',
      endDate: 'all',
      name: 'all'
    };

    setAllFiltersState({
      status: 'all',
      startDate: 'all',
      endDate: 'all',
      name: 'all'
    });
    setStatusFilter('all');
    setStartDate('all');
    setEndDate('all');
    setName('all');
    filter(allFilters);
  };

  const selectLibOnChange = (value, stateSetter, filterParam) => {
    stateSetter(value);
    allFilters = {
      ...allFiltersState,
      [filterParam]: value
    };
    setAllFiltersState(allFilters);
    filter(allFilters);
  };

  const returnStatusFilterHead = () => (
    <th scope="col">
            Status
      <select className="dropdownFilter" value={statusFilter} onChange={(e) => handleChange(e, setStatusFilter, 'status')}>
        <option value="all" className="optionTableStyle">all</option>
        <option value="Planned" className="optionTableStyle">Planned</option>
        <option value="On Leave" className="optionTableStyle">On Leave</option>
      </select>
    </th>
  );

  const returnStartMonthFilterHead = () => (
    <th scope="col">
            Starts
      <select className="dropdownFilter" value={startDate} onChange={(e) => handleChange(e, setStartDate, 'startDate')}>
        <option value="all" className="optionTableStyle">all</option>
        <option value="0" className="optionTableStyle">Jan</option>
        <option value="1" className="optionTableStyle">Feb</option>
        <option value="2" className="optionTableStyle">Mar</option>
        <option value="3" className="optionTableStyle">Apr</option>
        <option value="4" className="optionTableStyle">May</option>
        <option value="5" className="optionTableStyle">Jun</option>
        <option value="6" className="optionTableStyle">Jul </option>
        <option value="7" className="optionTableStyle">Aug </option>
        <option value="8" className="optionTableStyle">Sep </option>
        <option value="9" className="optionTableStyle">Oct </option>
        <option value="10" className="optionTableStyle">Nov </option>
        <option value="11" className="optionTableStyle">Dec</option>
      </select>
    </th>
  );

  const returnEndMonthFilterHead = () => (
    <th scope="col">
            Ends
      <select className="dropdownFilter" value={endDate} onChange={(e) => handleChange(e, setEndDate, 'endDate')}>
        <option value="all" className="optionTableStyle">all</option>
        <option value="0" className="optionTableStyle">Jan</option>
        <option value="1" className="optionTableStyle">Feb</option>
        <option value="2" className="optionTableStyle">Mar</option>
        <option value="3" className="optionTableStyle">Apr</option>
        <option value="4" className="optionTableStyle">May</option>
        <option value="5" className="optionTableStyle">Jun</option>
        <option value="6" className="optionTableStyle">Jul </option>
        <option value="7" className="optionTableStyle">Aug </option>
        <option value="8" className="optionTableStyle">Sep </option>
        <option value="9" className="optionTableStyle">Oct </option>
        <option value="10" className="optionTableStyle">Nov </option>
        <option value="11" className="optionTableStyle">Dec</option>
      </select>
    </th>
  );

  const returnNameFilterHead = () => (
    <th scope="col">
      Name <span className="dontshowText">name name xx</span>
      <span className="customSelectStyles">
        <Select
          options={allUsers}
          onChange={(opt) => selectLibOnChange(opt.label, setName, 'name')}
        />
      </span>
    </th>
  );

  const returnStatus = (status) => {
    if (status === 'Planned') {
      return (
        <button className={returnStatusClass(status)}>
          {status}
        </button>
      );
    }

    if (status === 'Approved') {
      return (
        <button className={returnStatusClass('Approved')}>
          On Leave
        </button>
      );
    }

    if (status === 'Taken') {
      return (
        <button className={returnStatusClass('Approved')}>
          On Leave
        </button>
      );
    }

    return '';
  };

  const returnData = () => (
    <table className="table holidaysTable" id="hrConsolidatedTrackerTable">
      <thead>
        <span className="resetFilters" onClick={resetFilters}>
          Reset All Filters
        </span>
        <tr>
          {returnNameFilterHead()}
          {returnStatusFilterHead()}
          <th scope="col">Days</th>
          {returnStartMonthFilterHead()}
          {returnEndMonthFilterHead()}
        </tr>
      </thead>
      <tbody>
        {
          filteredLeaves.map((leave) => (
            <tr key={leave._id}>
              <td>{`${leave.staff.fName} ${leave.staff.lName}`}</td>
              <td>
                {returnStatus(leave.status)}
              </td>
              <td>{leave.daysTaken}</td>
              <td>{new Date(leave.startDate).toDateString()}</td>
              <td>{new Date(leave.endDate).toDateString()}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );

  const generatePDf = (event) => {
    event.preventDefault();
    const input = document.getElementById('hrConsolidatedTrackerTable');

    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 1);
        const pdf = new JSPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imageWidth = canvas.width;
        const imageHeight = canvas.height;

        const ratio = imageWidth / imageHeight >= pageWidth / pageHeight
          ? pageWidth / imageWidth
          : pageHeight / imageHeight;
        pdf.addImage(imgData, 'JPEG', 0, 0, imageWidth * ratio, imageHeight * ratio);
        pdf.save('program_leave_tracker.pdf');
      });
  };

  return (
    <div className="row">
      <div className="col">
        <h3>
          {`${program} Consolidated Leave Tracker`}
          <button type="button" className="btn btn-secondary float-right" onClick={generatePDf}>
            Generate PDF
          </button>
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

ProgramLeaveTracker.propTypes = {
  token: PropTypes.string,
  email: PropTypes.string,
  gender: PropTypes.string,
  type: PropTypes.string,
  program: PropTypes.string
};

export default connect(mapStateToProps)(ProgramLeaveTracker);
