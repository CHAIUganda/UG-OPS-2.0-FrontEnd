import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import html2canvas from 'html2canvas';
import JSPDF from 'jspdf';
import Select from 'react-select';
import {
  CustomInput,
  Form,
  FormGroup
} from 'reactstrap';
import Cookies from 'js-cookie';

import * as sideBarActions from '../../../../../redux/actions/sideBarActions';
import * as authActions from '../../../../../redux/actions/authActions';

import CommonSpinner from '../../../../common/spinner';
import FilterNameButton from '../../../../common/filterNameButton';
import { BASE_URL, returnStatusClass } from '../../../../../config';
import './consolidatedLeaveBalances.css';

const matchDispatchToProps = {
  changeSection: sideBarActions.changeSection,
  changeActive: sideBarActions.changeActive,
  logUserOut: authActions.logUserOut
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
  changeActive,
  logUserOut
}) {
  const [showAnnual, setshowAnnual] = useState(true);
  const [showHome, setShowHome] = useState(false);
  const [showStudy, setShowStudy] = useState(false);
  const [showMaternity, setShowMaternity] = useState(false);
  const [showPaternity, setShowPaternity] = useState(false);
  const [showSick, setShowSick] = useState(false);
  const [showUnpaid, setShowUnpaid] = useState(false);
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

  const setUpThisPage = () => {
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
    setSpinner(true);
    setError('');

    if (token) {
      setUpThisPage();
    } else {
      Cookies.remove('token');
      logUserOut();
    }
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

    /** Reset switches */
    setshowAnnual(true);
    setShowHome(false);
    setShowStudy(false);
    setShowMaternity(false);
    setShowPaternity(false);
    setShowSick(false);
    setShowUnpaid(false);
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
        <table className="table removeTableBorders">
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
        <table className="table removeTableBorders">
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
        <table className="table removeTableBorders">
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
          <table className=" table removeTableBorders">
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
          <table className="table removeTableBorders">
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
          <table className="table removeTableBorders">
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

  const unPaidTableHead = () => {
    return (
      <>
        <th scope="col" colSpan="2">
          <table className="table removeTableBorders">
            <tr>
              <td colSpan="2">Unpaid</td>
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
    const returnColors = () => {
      if (l.leaveDetails.annualLeaveBal >= 10) {
        return returnStatusClass('rejectedWords');
      }
      if (l.leaveDetails.annualLeaveBal < 0) {
        return returnStatusClass('declined');
      }
      if (l.leaveDetails.annualLeaveBal >= 0) {
        return returnStatusClass('approvedWords');
      }
      return '';
    };
    return (<>
      <td>{l.leaveDetails.annualLeaveTaken}</td>
      <td>
        <span className={returnColors()}>{l.leaveDetails.annualLeaveBal}</span>
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

  const unpaidTd = (l) => {
    return (
      <>
        <td>{l.leaveDetails.unPaidLeaveTaken}</td>
        <td>{l.leaveDetails.unpaidLeaveBal}</td>
      </>
    );
  };

  const leavesSwitches = () => {
    return (
      <>
        <h4 className="text-left ml-2">Set the leave types to display</h4>
        <Form>
          <FormGroup>
            <div className="text-left ml-5">
              <CustomInput
                type="switch"
                id="AnnualSwitch"
                name="customSwitch"
                label="Annual Leave"
                checked={showAnnual}
                onChange={(e) => setshowAnnual(e.target.checked) }
              />
            </div>
          </FormGroup>
          <FormGroup>
            <div className="text-left ml-5">
              <CustomInput
                type="switch"
                id="HomeSwitch"
                name="customSwitch"
                label="Home Leave"
                checked={showHome}
                onChange={(e) => setShowHome(e.target.checked) }
              />
            </div>
          </FormGroup>
          <FormGroup>
            <div className="text-left ml-5">
              <CustomInput
                type="switch"
                id="studySwitch"
                name="customSwitch"
                label="Study Leave"
                checked={showStudy}
                onChange={(e) => setShowStudy(e.target.checked) }
              />
            </div>
          </FormGroup>
          <FormGroup>
            <div className="text-left ml-5">
              <CustomInput
                type="switch"
                id="maternitySwitch"
                name="customSwitch"
                label="Maternity Leave"
                checked={showMaternity}
                onChange={(e) => setShowMaternity(e.target.checked) }
              />
            </div>
          </FormGroup>
          <FormGroup>
            <div className="text-left ml-5">
              <CustomInput
                type="switch"
                id="paternitySwitch"
                name="customSwitch"
                label="Paternity Leave"
                checked={showPaternity}
                onChange={(e) => setShowPaternity(e.target.checked) }
              />
            </div>
          </FormGroup>
          <FormGroup>
            <div className="text-left ml-5">
              <CustomInput
                type="switch"
                id="sickSwitch"
                name="customSwitch"
                label="Sick Leave"
                checked={showSick}
                onChange={(e) => setShowSick(e.target.checked) }
              />
            </div>
          </FormGroup>
          <FormGroup>
            <div className="text-left ml-5">
              <CustomInput
                type="switch"
                id="unPaidSwitch"
                name="customSwitch"
                label="Unpaid Leave"
                checked={showUnpaid}
                onChange={(e) => setShowUnpaid(e.target.checked) }
              />
            </div>
          </FormGroup>
        </Form>
      </>
    );
  };

  const returnData = () => (
    <table className="table holidaysTable">
      <thead>
        <tr>
          {returnNameFilterHead()}
          {returnEndProgramFilterHead()}
          { showAnnual ? returnAnnualLeaveFilterHead() : null }
          { showHome ? homeTableHead() : null }
          {showStudy ? studyTableHead() : null }
          { showMaternity ? maternityTableHead() : null }
          { showPaternity ? paternityTableHead() : null }
          { showSick ? sickTableHead() : null }
          { showUnpaid ? unPaidTableHead() : null }
        </tr>
      </thead>
      <tbody>
        {
          filteredLeaves.map((l) => (
            <tr key={l._id}>
              <td>{`${l.fName} ${l.lName}`}</td>
              <td>{l.programShortForm}</td>
              { showAnnual ? annualLeaveTd(l) : null }
              { showHome ? homeLeaveTd(l) : null }
              { showStudy ? studyTableTd(l) : null }
              { showMaternity ? maternityTableTd(l) : null }
              { showPaternity ? paternityTableTd(l) : null }
              { showSick ? sickTableTd(l) : null }
              { showUnpaid ? unpaidTd(l) : null }
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
        <div>
          <h3>
            Consolidated Leave Balances
            <button type="button" className="btn btn-secondary float-right" onClick={generatePDf}>
            Generate PDF
            </button>
          </h3>
          {leavesSwitches()}
          <div id="hrConsolidatedTrackerTable">
            {generateFilterRibbon()}
            <div className="row">
              <div className="col">
                {returnData() }
              </div>
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
  changeActive: PropTypes.func,
  logUserOut: PropTypes.func,
};

export default connect(mapStateToProps, matchDispatchToProps)(ConsolidatedLeaveBalances);
