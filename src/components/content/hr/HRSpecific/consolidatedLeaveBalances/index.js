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
import './consolidatedLeaveBalances.css';

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

function ConsolidatedLeaveBalances({
  token,
  roles,
  changeSection,
  changeActive
}) {
  const [spinner, setSpinner] = useState(false);
  const [error, setError] = useState('');
  const [allLeaves, setallLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [allPrograms, setAllPRograms] = useState([]);
  const [program, setProgram] = useState('all');
  const [allUsers, setAllUsers] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [name, setName] = useState([]);
  const [annualSort, setAnnualSort] = useState('all');
  const [allFiltersState, setAllFiltersState] = useState(
    {
      program: 'all',
      name: [],
      annualSort: 'all'
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
  changeActive('ConsolidatedLeaveBalances');

  let allFilters = {
    program: 'all',
    name: [],
    annualSort: 'all'
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
        setAllUsers([...arrayToSet]);
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
        if (fil === 'annualSort') {
          array2Filter = array2Filter.filter((leave) => leave.fName);
        } else {
          array2Filter = array2Filter.filter((leave) => leave[fil]);
        }
      } else if (fil === 'name') {
        if (filterObj.name.length <= 0) {
          array2Filter = array2Filter.filter((leave) => leave.fName);
        } else {
          const arr = [];
          filterObj.name.forEach((singleUser) => {
            array2Filter.forEach((leave) => {
              if (leave.email === singleUser.value) {
                arr.push(leave);
              }
            });
          });
          array2Filter = arr;
        }
      } else if (fil === 'annualSort') {
        if (filterObj[fil] === 'red') {
          array2Filter = array2Filter.filter((leave) => leave.leaveDetails.annualLeaveBal > 10);
        } else {
          array2Filter = array2Filter.filter((leave) => leave.leaveDetails.annualLeaveBal <= 10);
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
      program: 'all',
      name: [],
      annualSort: 'all'
    };
    setAllFiltersState({
      program: 'all',
      name: [],
      annualSort: 'all'
    });
    setAnnualSort('all');
    setProgram('all');
    setName([]);
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

  const returnEndProgramFilterHead = () => (
    <th scope="col">
            program
      <select className="form-control" value={program} onChange={(e) => handleChange(e, setProgram, 'programShortForm')}>
        <option value="all">all</option>
        {
          allPrograms.map((prog) => (
            <option key={prog._id} value={prog.shortForm}>{prog.shortForm}</option>
          ))
        }
      </select>
    </th>
  );

  const returnAnnualLeaveFilterHead = () => {
    return (
      <th scope="col" colSpan="2">
        <table className="removeTableBorders">
          <tr>
            <td colSpan="2">
            Annual
              <select className="form-control" value={annualSort} onChange={(e) => handleChange(e, setAnnualSort, 'annualSort')}>
                <option value="all" >all</option>
                <option value="green" >green</option>
                <option value="red" >red</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Used</td>
            <td>Balance</td>
          </tr>
        </table>
      </th>
    );
  /*
  (
    <th scope="col">
            Annual
      <select className="form-control" value={annualSort} onChange={(e) =>
        handleChange(e, setAnnualSort, 'annualSort')}>
        <option value="all" >all</option>
        <option value="green" >green</option>
        <option value="red" >red</option>
      </select>
    </th>
  );
  */
  };

  const returnNameFilterHead = () => {
    return (
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
  };

  const studyTableHead = () => {
    return (
      <th scope="col" colSpan="2">
        <table className="removeTableBorders">
          <tr>
            <td colSpan="2">Study</td>
          </tr>
          <tr>
            <td>Used</td>
            <td>Balance</td>
          </tr>
        </table>
      </th>
    );
  };

  const homeTableHead = () => {
    return (
      <th scope="col" colSpan="2">
        <table className="removeTableBorders">
          <tr>
            <td colSpan="2">Home</td>
          </tr>
          <tr>
            <td>Used</td>
            <td>Balance</td>
          </tr>
        </table>
      </th>
    );
  };

  const maternityTableHead = () => {
    return (
      <>
        <th scope="col" colSpan="2">
          <table className="removeTableBorders">
            <tr>
              <td colSpan="2">Maternity</td>
            </tr>
            <tr>
              <td>Used</td>
              <td>Balance</td>
            </tr>
          </table>
        </th>
      </>
    );
  };

  const paternityTableHead = () => {
    return (
      <>
        <th scope="col">
          <table className="removeTableBorders">
            <tr>
              <td>Paternity</td>
            </tr>
            <tr>
              <td>Used</td>
            </tr>
          </table>
        </th>
      </>
    );
  };

  const sickTableHead = () => {
    return (
      <>
        <th scope="col" colSpan="2">
          <table className="removeTableBorders">
            <tr>
              <td colSpan="2">Sick</td>
            </tr>
            <tr>
              <td>Used</td>
              <td>Balance</td>
            </tr>
          </table>
        </th>
      </>
    );
  };

  /** TD */

  const homeLeaveTd = (l) => {
    return (
      <>
        <td>
          { l.type.toLocaleLowerCase() === 'local' || l.type.toLocaleLowerCase() === 'national'
            ? 'NA'
            : `${l.leaveDetails.homeLeaveTaken}`
          }
        </td>
        <td>
          { l.type.toLocaleLowerCase() === 'local' || l.type.toLocaleLowerCase() === 'national'
            ? 'NA'
            : `${l.leaveDetails.homeLeaveBal}`
          }
        </td>
      </>
    );
  };

  const annualLeaveTd = (l) => {
    return (<>
      <td>{l.leaveDetails.annualLeaveTaken}</td>
      <td>
        <span className={
          l.leaveDetails.annualLeaveBal > 10
            ? returnStatusClass('rejectedWords mt-1')
            : returnStatusClass('approvedWords mt-1')
        }>{l.leaveDetails.annualLeaveBal}</span>
      </td>
    </>);
  };

  const studyTableTd = (l) => {
    return (
      <>
        <td>{l.leaveDetails.studyLeaveTaken}</td>
        <td>{l.leaveDetails.studyLeaveBal}</td>
      </>
    );
  };

  const maternityTableTd = (l) => {
    return (
      <>
        <td>
          {
            (l.gender === 'Female' || l.gender === 'female')
              ? l.leaveDetails.maternityLeaveTaken
              : 'NA'
          }
        </td>
        <td>
          {
            (l.gender === 'Female' || l.gender === 'female')
              ? l.leaveDetails.maternityLeaveBal
              : 'NA'
          }
        </td>
      </>
    );
  };

  const paternityTableTd = (l) => {
    return (
      <>
        <td>
          {
            (l.gender === 'Male' || l.gender === 'male')
              ? l.leaveDetails.paternityLeaveTaken
              : 'NA'
          }
        </td>
      </>
    );
  };

  const sickTableTd = (l) => {
    return (
      <>
        <td>{l.leaveDetails.sickLeaveTaken}</td>
        <td>{l.leaveDetails.sickLeaveBal}</td>
      </>
    );
  };

  const returnData = () => (
    <table className="table holidaysTable">
      <thead>
        <tr>
          {returnNameFilterHead()}
          {returnEndProgramFilterHead()}
          {returnAnnualLeaveFilterHead()}
          {homeTableHead()}
          {studyTableHead()}
          {maternityTableHead()}
          {paternityTableHead()}
          {sickTableHead()}
          <th scope="col">Unpaid</th>
        </tr>
      </thead>
      <tbody>
        {
          filteredLeaves.map((l) => (
            <tr key={l._id}>
              <td>{`${l.fName} ${l.lName}`}</td>
              <td>{l.programShortForm}</td>
              {annualLeaveTd(l)}
              {homeLeaveTd(l)}
              {studyTableTd(l)}
              {maternityTableTd(l)}
              {paternityTableTd(l)}
              {sickTableTd(l)}
              <td>{l.leaveDetails.sickLeaveTaken} ~ {l.leaveDetails.sickLeaveBal}</td>
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
        pdf.save('consolidated_leave_balances.pdf');
      });
  };

  return (
    <div className="row">
      <div className="col">
        <div id="hrConsolidatedTrackerTable">
          <h3>
            Consolidated Leave Balances
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
    </div>
  );
}

ConsolidatedLeaveBalances.propTypes = {
  token: PropTypes.string,
  email: PropTypes.string,
  gender: PropTypes.string,
  type: PropTypes.string,
  roles: PropTypes.object,
  changeSection: PropTypes.func,
  changeActive: PropTypes.func
};

export default connect(mapStateToProps, matchDispatchToProps)(ConsolidatedLeaveBalances);
