import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { FiEdit } from 'react-icons/fi';
import { IconContext } from 'react-icons';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import JSPDF from 'jspdf';
import { CustomInput } from 'reactstrap';

import * as sideBarActions from '../../../../redux/actions/sideBarActions';
import { BASE_URL } from '../../../../config';
import CommonSpinner from '../../../common/spinner';
import FilterNameButton from '../../../common/filterNameButton';

import './viewAllUsers.css';

const matchDispatchToProps = {
  changeSection: sideBarActions.changeSection,
  changeActive: sideBarActions.changeActive
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
  roles: state.auth.roles
});

function ViewAllUsers({
  token,
  roles,
  changeSection,
  changeActive
}) {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [error, setError] = useState('');
  const [selectLibArray, setSelectLibArray] = useState([]);
  const [displayEmail, setDisplayEmail] = useState('true');
  const [displayNssf, setDisplayNssf] = useState('true');
  const [displayTIN, setDisplayTIN] = useState('true');
  const [name, setName] = useState([]);
  const [allPrograms, setAllPRograms] = useState([]);
  const [program, setProgram] = useState('all');

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
  changeActive('ViewAllUsers');

  const filterRecords = (users, programToFilterBy) => {
    let filtered = [];
    if (programToFilterBy) {
      if (programToFilterBy === 'all' && name.length < 1) {
        filtered = [...allUsers];
      } else if (programToFilterBy === 'all' && name.length > 1) {
        name.forEach((n) => {
          allUsers.forEach((u) => {
            if (n.value === u._id) {
              filtered.push(u);
            }
          });
        });
      } else if (name.length < 1 && programToFilterBy !== 'all') {
        filtered = allUsers.filter((u) => u.programShortForm === programToFilterBy);
      } else {
        name.forEach((n) => {
          allUsers.forEach((u) => {
            if (n.value === u._id) {
              filtered.push(u);
            }
          });
        });
        filtered = filtered.filter((f) => f.programShortForm === programToFilterBy);
      }
      // set filtered docs
      setFilteredUsers(filtered);
    }

    if (users) {
      if (users.length < 1 && program === 'all') {
        filtered = [...allUsers];
      } else if (users.length < 1 && program !== 'all') {
        filtered = allUsers.filter((u) => u.programShortForm === program);
      } else if (users.length > 0 && program === 'all') {
        users.forEach((n) => {
          allUsers.forEach((u) => {
            if (n.value === u._id) {
              filtered.push(u);
            }
          });
        });
      } else if (users.length > 0 && program !== 'all') {
        users.forEach((n) => {
          allUsers.forEach((u) => {
            if (n.value === u._id) {
              filtered.push(u);
            }
          });
        });
        filtered = filtered.filter((f) => f.programShortForm === program);
      }
      setFilteredUsers(filtered);
    }
  };

  const selectLibOnChange = (selectedUser) => {
    const alreadyFiltered = name.some((u) => u.value === selectedUser.value);
    const arr = [...name];
    let filter = [...filteredUsers];

    if (!alreadyFiltered) {
      arr.push(selectedUser);
      filter = [];

      allUsers.forEach((u) => {
        arr.forEach((pickedUser) => {
          if (u._id === pickedUser.value) {
            filter.push(u);
          }
        });
      });
      setName(arr);
      filterRecords(arr, false);
      // setFilteredUsers(filter);
    }
  };

  const resetFilters = () => {
    setFilteredUsers(allUsers);
    setProgram('all');
    setName([]);
    setDisplayTIN('true');
    setDisplayNssf('true');
    setDisplayEmail('true');
  };


  const returnNameFilterHead = () => (
    <th scope="col">
      Name
      <span className="customSelectStyles">
        <Select
          options={selectLibArray}
          onChange={
            (opt) => selectLibOnChange(opt)}
          value={null}
        />
      </span>
    </th>
  );

  const filterByPrograms = (value) => {
    setProgram(value);
    filterRecords(false, value);
  };

  const returnProgramFilterHead = () => (
    <th scope="col">
      Program
      <span className="customSelectStyles">
        <CustomInput
          type="select"
          id="programCustomSelect"
          name="customSelect"
          value={program}
          onChange={(e) => filterByPrograms(e.target.value)}
        >
          <option value="all" className="optionTableStyle">all</option>
          {
            allPrograms.map((prog) => (
              <option key={prog._id} value={prog.shortForm}>{prog.shortForm}</option>
            ))
          }
        </CustomInput>
      </span>
    </th>
  );

  const returnEmailFilterHead = () => (
    <th scope="col">
      Email
      <span className="customSelectStyles">
        <CustomInput
          type="select"
          id="emailCustomSelect"
          name="customSelect"
          value={displayEmail}
          onChange={(e) => setDisplayEmail(e.target.value)}
        >
          <option value='true'>display</option>
          <option value='false'>Dont display</option>
        </CustomInput>
      </span>
    </th>
  );

  const returnNSSFFilterHead = () => (
    <th scope="col">
      NSSF Number
      <span className="customSelectStyles">
        <CustomInput
          type="select"
          id="nssfCustomSelect"
          name="customSelect"
          value={displayNssf}
          onChange={(e) => setDisplayNssf(e.target.value)}
        >
          <option value='true'>display</option>
          <option value='false'>Dont display</option>
        </CustomInput>
      </span>
    </th>
  );

  const returnTINFilterHead = () => (
    <th scope="col">
      TIN
      <span className="customSelectStyles">
        <CustomInput
          type="select"
          id="tinCustomSelect"
          name="customSelect"
          value={displayTIN}
          onChange={(e) => setDisplayTIN(e.target.value)}
        >
          <option value='true'>display</option>
          <option value='false'>Dont display</option>
        </CustomInput>
      </span>
    </th>
  );

  const returnData = () => (
    <table className="table holidaysTable" id="hrConsolidatedTrackerTable">
      <thead>
        <tr>
          <th scope="col">#</th>
          {returnNameFilterHead()}
          {returnProgramFilterHead()}
          {returnEmailFilterHead()}
          {returnNSSFFilterHead()}
          {returnTINFilterHead()}
          <th scope="col">Edit</th>
        </tr>
      </thead>
      <tbody>
        {
          filteredUsers.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{`${user.fName} ${user.lName}`}</td>
              <td>{user.programShortForm}</td>
              <td>{
                displayEmail === 'true'
                  ? user.email
                  : ''
              }</td>
              <td>{
                displayNssf === 'true'
                  ? user.nssfNumber
                  : ''
              }</td>
              <td>{
                displayTIN === 'true'
                  ? user.tinNumber
                  : ''
              }</td>
              <td>
                <span className="pointerCursor changeHColor">
                  <Link to={{
                    pathname: '/hr/EditUser',
                    state: {
                      propsPassed: true,
                      user
                    }
                  }}>
                    <IconContext.Provider value={{ size: '2em' }}>
                      <FiEdit />
                    </IconContext.Provider>
                  </Link>
                </span>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );

  const getProgrammes = () => {
    const endPoint = `${BASE_URL}hrApi/getPrograms`;
    axios.defaults.headers.common = { token };
    axios.get(endPoint)
      .then((res) => {
        setSpinner(false);
        setAllPRograms(res.data);
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
    axios.defaults.headers.common = { token };
    const apiRoute = `${BASE_URL}auth/getUsers`;

    axios.get(apiRoute)
      . then((res) => {
        setAllUsers(res.data);
        setFilteredUsers(res.data);
        const arrayToSet = res.data.map((user) => ({
          label: `${user.fName} ${user.lName}`,
          value: user._id
        }));
        setSelectLibArray([...arrayToSet]);
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

  const removePerson = (email) => {
    const removeName = name.filter((n) => n.value !== email);

    if (removeName.length <= 0) {
      setName([]);
      setFilteredUsers(allUsers);
    } else {
      setName(removeName);
      filterRecords(removeName, false);
    }
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
    const input = document.getElementById('allUSersContent');

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
        pdf.save('users.pdf');
      });
  };

  return (
    <div className="row">
      <div className="col" id="allUSersContent">
        <h3 className="text-center">
          All users
          <button type="button" className="btn btn-secondary float-right" onClick={generatePDf}>
            Generate PDF
          </button>
        </h3>
        {generateFilterRibbon()}
        {returnData()}
      </div>
    </div>
  );
}

ViewAllUsers.propTypes = {
  token: PropTypes.string,
  roles: PropTypes.object,
  changeSection: PropTypes.func,
  changeActive: PropTypes.func
};

export default connect(mapStateToProps, matchDispatchToProps)(ViewAllUsers);
