import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import html2canvas from 'html2canvas';
import JSPDF from 'jspdf';
import Select from 'react-select';

import CommonSpinner from '../../../../common/spinner';
import { BASE_URL, /* returnStatusClass */ } from '../../../../../config';
import './consolidatedLeaveBalances.css';

const mapStateToProps = (state) => ({
  token: state.auth.token,
  email: state.auth.email,
  gender: state.auth.gender,
  type: state.auth.type
});

function ConsolidatedLeaveBalances({ token }) {
  const [spinner, setSpinner] = useState(false);
  const [error, setError] = useState('');
  const [allLeaves, setallLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [allPrograms, setAllPRograms] = useState([]);
  const [program, setProgram] = useState('all');
  const [allUsers, setAllUsers] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [name, setName] = useState('all');
  const [allFiltersState, setAllFiltersState] = useState(
    {
      program: 'all',
      name: 'all'
    }
  );

  let allFilters = {
    program: 'all',
    name: 'all'
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
    const endPoint = `${BASE_URL}leaveApi/getAllStaffLeavesTaken`;
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
        if (fil === 'name' && filterObj.name === 'all') {
          array2Filter = array2Filter.filter((leave) => leave.fName);
        } else {
          array2Filter = array2Filter.filter((leave) => leave[fil]);
        }
      } else if (fil === 'name' && filterObj.name === 'all') {
        array2Filter = array2Filter.filter((leave) => leave.fName);
      } else if (fil === 'name') {
        array2Filter = array2Filter.filter((leave) => `${leave.fName} ${leave.lName}` === allFilters.name);
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

  const selectLibOnChange = (value, stateSetter, filterParam) => {
    stateSetter(value);
    allFilters = {
      ...allFiltersState,
      [filterParam]: value
    };
    setAllFiltersState(allFilters);
    filter(allFilters);
  };

  const returnEndProgramFilterHead = () => (
    <th scope="col">
            program
      <select className="dropdownFilter" value={program} onChange={(e) => handleChange(e, setProgram, 'program')}>
        <option value="all" className="optionTableStyle">all</option>
        {
          allPrograms.map((prog) => (
            <option key={prog._id} value={prog.name} className="optionTableStyle">{prog.name}</option>
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
          onChange={(opt) => selectLibOnChange(opt.label, setName, 'name')}
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
          <th scope="col">Annual</th>
          <th scope="col">Home</th>
          <th scope="col">Study</th>
          <th scope="col">Maternity</th>
          <th scope="col">Paternity</th>
          <th scope="col">Sick</th>
          <th scope="col">Unpaid</th>
        </tr>
      </thead>
      <tbody>
        {
          filteredLeaves.map((l) => (
            <tr key={l._id}>
              <td>{`${l.fName} ${l.lName}`}</td>
              <td>{l.program}</td>
              <td>{l.leaveDetails.annualLeaveTaken} ~ {l.leaveDetails.annualLeaveBal}</td>
              <td>
                { l.type === 'local'
                  ? 'local'
                  : `${l.leaveDetails.homeLeaveTaken} ~ ${l.leaveDetails.homeLeaveBal}`
                }
              </td>
              <td>{l.leaveDetails.studyLeaveTaken} ~ {l.leaveDetails.studyLeaveBal}</td>
              <td>
                {
                  (l.gender === 'Female' || l.gender === 'female')
                    ? `${l.leaveDetails.maternityLeaveTaken} ~ ${l.leaveDetails.maternityLeaveBal}`
                    : '_'
                }
              </td>
              <td>
                {
                  (l.gender === 'Male' || l.gender === 'male')
                    ? `${l.leaveDetails.paternityLeaveTaken} ~ _`
                    : '_'
                }
              </td>
              <td>{l.leaveDetails.sickLeaveTaken} ~ {l.leaveDetails.sickLeaveBal}</td>
              <td>{l.leaveDetails.sickLeaveTaken} ~ {l.leaveDetails.sickLeaveBal}</td>
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
        pdf.save('invoice.pdf');
      });
  };

  return (
    <div className="row">
      <div className="col">
        <h3>
          <button type="button" className="btn btn-info float-left">
            KEY: (Used ~ Balance)
          </button>
            Consolidated Leave Balances
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

ConsolidatedLeaveBalances.propTypes = {
  token: PropTypes.string,
  email: PropTypes.string,
  gender: PropTypes.string,
  type: PropTypes.string,
};

export default connect(mapStateToProps)(ConsolidatedLeaveBalances);
