import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import html2canvas from 'html2canvas';
import JSPDF from 'jspdf';
import Select from 'react-select';

import * as sideBarActions from '../../../../../redux/actions/sideBarActions';
import CommonSpinner from '../../../../common/spinner';
import FilterNameButton from '../../../../common/filterNameButton';
import { BASE_URL, returnStatusClass } from '../../../../../config';
import './consolidatedTracker.css';

const matchDispatchToProps = {
  changeSection: sideBarActions.changeSection,
  changeActive: sideBarActions.changeActive
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
  email: state.auth.email,
  gender: state.auth.gender,
  type: state.auth.type,
  roles: state.auth.roles
});

function ConsolidatedTracker({
  token,
  roles,
  changeSection,
  changeActive
}) {
  const [spinner, setSpinner] = useState(false);
  const [error, setError] = useState('');
  const [allLeaves, setallLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('all');
  const [endDate, setEndDate] = useState('all');
  const [allPrograms, setAllPRograms] = useState([]);
  const [program, setProgram] = useState('all');
  const [allUsers, setAllUsers] = useState([]);
  const [name, setName] = useState([]);
  const [allFiltersState, setAllFiltersState] = useState(
    {
      type: 'all',
      status: 'all',
      startDate: 'all',
      endDate: 'all',
      program: 'all',
      name: []
    }
  );

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

  changeSection('Human Resource');
  changeActive('ConsolidatedTracker');

  let allFilters = {
    type: 'all',
    status: 'all',
    startDate: 'all',
    endDate: 'all',
    program: 'all',
    name: []
  };

  const getUsers = () => {
    axios.defaults.headers.common = { token };
    const apiRoute = `${BASE_URL}auth/getUsers`;
    axios.get(apiRoute)
      . then((res) => {
        setSpinner(false);
        const arrayToSet = res.data.map((user) => ({
          label: `${user.fName} ${user.lName}`,
          value: user.email
        }));
        setAllUsers([
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

  const getProgrammes = () => {
    const endPoint = `${BASE_URL}hrApi/getPrograms`;
    axios.defaults.headers.common = { token };
    axios.get(endPoint)
      .then((res) => {
        setAllPRograms(res.data);
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
  };

  useEffect(() => {
    setSpinner(true);
    setError('');
    axios.defaults.headers.common = { token };
    const endPoint = `${BASE_URL}leaveApi/getAllStaffLeaves/all/all`;
    axios.get(endPoint)
      .then((res) => {
        setallLeaves(res.data);
        setFilteredLeaves(res.data);
        getProgrammes();
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
        array2Filter = array2Filter.filter((leave) => leave[fil]);
      } else if (fil === 'startDate' || fil === 'endDate') {
        array2Filter = array2Filter.filter((leave) => `${new Date(leave[fil]).getMonth()}` === allFilters[fil]);
      } else if (fil === 'name') {
        if (filterObj.name.length <= 0) {
          array2Filter = array2Filter.filter((leave) => leave.staff.email);
        } else {
          const arr = [];
          filterObj.name.forEach((singleUser) => {
            array2Filter.forEach((leave) => {
              if (leave.staff.email === singleUser.value) {
                arr.push(leave);
              }
            });
          });
          array2Filter = arr;
        }
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
      type: 'all',
      status: 'all',
      startDate: 'all',
      endDate: 'all',
      program: 'all',
      name: []
    };

    setProgram('all');
    setEndDate('all');
    setStartDate('all');
    setStatusFilter('all');
    setTypeFilter('all');
    setName([]);

    setAllFiltersState({
      type: 'all',
      status: 'all',
      startDate: 'all',
      endDate: 'all',
      program: 'all',
      name: []
    });
    filter(allFilters);
  };

  const selectLibOnChange = (email, stateSetter, filterParam) => {
    const oneUser = allUsers.find((u) => u.value === email);
    const alreadyFiltered = name.some((u) => u.value === email);
    const arr = [...name];
    if (!alreadyFiltered) {
      arr.push(oneUser);
    }
    stateSetter(arr);
    allFilters = {
      ...allFiltersState,
      [filterParam]: arr
    };
    setAllFiltersState(allFilters);
    filter(allFilters);
  };

  const returnTypeFilterHead = () => (
    <th scope="col">
            Type
      <select className="form-control" value={typeFilter} onChange={(e) => handleChange(e, setTypeFilter, 'type')}>
        <option value="all">all</option>
        <option value="Annual">Annual</option>
        <option value="Paternity">Paternity</option>
        <option value="Home">Home</option>
        <option value="Maternity">Maternity</option>
        <option value="Sick">Sick</option>
        <option value="Unpaid">Unpaid</option>
        <option value="Study">Study</option>
      </select>
    </th>
  );

  const returnStatusFilterHead = () => (
    <th scope="col">
            Status
      <select className="form-control" value={statusFilter} onChange={(e) => handleChange(e, setStatusFilter, 'status')}>
        <option value="all">all</option>
        <option value="Planned">Planned</option>
        <option value="Pending Supervisor">Pending Supervisor</option>
        <option value="Cancelled">Cancelled</option>
        <option value="Supervisor Declined">Supervisor Declined</option>
        <option value="Country Director Declined">Country Director Declined</option>
        <option value="Approved">Approved</option>
        <option value="Taken">Taken </option>
        <option value="Not taken">Not taken </option>
      </select>
    </th>
  );

  const returnStartMonthFilterHead = () => (
    <th scope="col">
            Starts
      <select className="form-control" value={startDate} onChange={(e) => handleChange(e, setStartDate, 'startDate')}>
        <option value="all">all</option>
        <option value="0">Jan</option>
        <option value="1">Feb</option>
        <option value="2">Mar</option>
        <option value="3">Apr</option>
        <option value="4">May</option>
        <option value="5">Jun</option>
        <option value="6">Jul </option>
        <option value="7">Aug </option>
        <option value="8">Sep </option>
        <option value="9">Oct </option>
        <option value="10">Nov </option>
        <option value="11">Dec</option>
      </select>
    </th>
  );

  const returnEndMonthFilterHead = () => (
    <th scope="col">
            Ends
      <select className="form-control" value={endDate} onChange={(e) => handleChange(e, setEndDate, 'endDate')}>
        <option value="all">all</option>
        <option value="0">Jan</option>
        <option value="1">Feb</option>
        <option value="2">Mar</option>
        <option value="3">Apr</option>
        <option value="4">May</option>
        <option value="5">Jun</option>
        <option value="6">Jul </option>
        <option value="7">Aug </option>
        <option value="8">Sep </option>
        <option value="9">Oct </option>
        <option value="10">Nov </option>
        <option value="11">Dec</option>
      </select>
    </th>
  );

  const returnEndProgramFilterHead = () => (
    <th scope="col">
            program
      <select className="form-control" value={program} onChange={(e) => handleChange(e, setProgram, 'programShortForm')}>
        <option value="all" className="optionTableStyle">all</option>
        {
          allPrograms.map((prog) => (
            <option key={prog._id} value={prog.shortForm}>{prog.shortForm}</option>
          ))
        }
      </select>
    </th>
  );

  const returnNameFilterHead = () => (
    <th scope="col">
      Name <span className="dontshowText">name name xx</span>
      <span className="customSelectStyles">
        <Select
          options={allUsers}
          onChange={(opt) => selectLibOnChange(opt.value, setName, 'name')}
          value={null}
        />
      </span>
    </th>
  );

  const returnData = () => (
    <table className="table holidaysTable" id="hrConsolidatedTrackerTable">
      <thead>
        <tr>
          {returnNameFilterHead()}
          {returnEndProgramFilterHead()}
          {returnTypeFilterHead()}
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
              <td>{leave.programShortForm}</td>
              <td>{leave.type}</td>
              <td>
                <button className={returnStatusClass(leave.status)}>
                  {leave.status}
                </button>
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

  const removePerson = (email) => {
    const arr = name.filter((u) => u.value !== email);
    setName(arr);
    allFilters = {
      ...allFiltersState,
      name: arr
    };
    setAllFiltersState(allFilters);
    filter(allFilters);
  };

  const generateFilterRibbon = () => (
    <div className="row">
      <div className="col text-left filterRibbon">
        <span className="resetFilters" onClick={resetFilters}>
        Reset All Filters
        </span>
        {
          name.map((n, index) => (
            <FilterNameButton
              key={`${index}${n.value}`}
              person={n}
              removePerson={removePerson}
            />
          ))
        }
      </div>
    </div>
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
        pdf.save('consolidated_leave_tracker.pdf');
      });
  };

  return (
    <div className="row">
      <div className="col">
        <h3>
            Consolidated Leave Tracker
          <button type="button" className="btn btn-secondary float-right" onClick={generatePDf}>
            Generate PDF
          </button>
        </h3>
        {generateFilterRibbon()}
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
  roles: PropTypes.object,
  changeSection: PropTypes.func,
  changeActive: PropTypes.func
};

export default connect(mapStateToProps, matchDispatchToProps)(ConsolidatedTracker);
