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

import { BASE_URL } from '../../../../config';
import CommonSpinner from '../../../common/spinner';
import FilterNameButton from '../../../common/filterNameButton';

import './viewAllUsers.css';

const mapStateToProps = (state) => ({
  token: state.auth.token
});

function ViewAllUsers({ token }) {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [error, setError] = useState('');
  const [selectLibArray, setSelectLibArray] = useState([]);
  const [displayEmail, setDisplayEmail] = useState('true');
  const [displayNssf, setDisplayNssf] = useState('true');
  const [displayTIN, setDisplayTIN] = useState('true');
  const [name, setName] = useState([]);

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
    }
    setName(arr);
    setFilteredUsers(filter);
  };

  const resetFilters = () => {
    setFilteredUsers(allUsers);
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
          {returnNameFilterHead()}
          {returnEmailFilterHead()}
          {returnNSSFFilterHead()}
          {returnTINFilterHead()}
          <th scope="col">Edit</th>
        </tr>
      </thead>
      <tbody>
        {
          filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{`${user.fName} ${user.lName}`}</td>
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

  useEffect(() => {
    setSpinner(true);
    axios.defaults.headers.common = { token };
    const apiRoute = `${BASE_URL}auth/getUsers`;

    axios.get(apiRoute)
      . then((res) => {
        setSpinner(false);
        setAllUsers(res.data);
        setFilteredUsers(res.data);
        const arrayToSet = res.data.map((user) => ({
          label: `${user.fName} ${user.lName}`,
          value: user._id
        }));
        setSelectLibArray([...arrayToSet]);
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
    const removeRecord = filteredUsers.filter((u) => u._id !== email);

    if (removePerson.length <= 0) {
      setName([]);
      setFilteredUsers(allUsers);
    } else {
      setName(removeName);
      setFilteredUsers(removeRecord);
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
  token: PropTypes.string
};

export default connect(mapStateToProps)(ViewAllUsers);
