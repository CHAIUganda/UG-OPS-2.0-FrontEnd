import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import Select from 'react-select';

import { BASE_URL } from '../../../../../config';
import CommonSpinner from '../../../../common/spinner';
import './nssfAndTin.css';

const mapStateToProps = (state) => ({
  token: state.auth.token
});

function NssfAndTin({ token }) {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [error, setError] = useState('');
  const [selectLibArray, setSelectLibArray] = useState([]);

  const selectLibOnChange = (id) => {
    if (id === 'all') {
      setFilteredUsers(allUsers);
    } else {
      const newArr = allUsers.filter((user) => user._id === id);
      setFilteredUsers(newArr);
    }
  };

  const returnNameFilterHead = () => (
    <th scope="col">
      Name
      <span className="customSelectStyles">
        <Select
          options={selectLibArray}
          onChange={(opt) => selectLibOnChange(opt.value)}
        />
      </span>
    </th>
  );

  const returnData = () => (
    <table className="table holidaysTable" id="hrConsolidatedTrackerTable">
      <thead>
        <tr>
          {returnNameFilterHead()}
          <th scope="col">Email</th>
          <th scope="col">NSSF</th>
          <th scope="col">TIN</th>
        </tr>
      </thead>
      <tbody>
        {
          filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{`${user.fName} ${user.lName}`}</td>
              <td>{user.email}</td>
              <td>{user.nssfNumber}</td>
              <td>{user.tinNumber}</td>
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
        setSelectLibArray([
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

  return (
    <div className="row">
      <div className="col">
        <h3 className="text-center">All users</h3>
        {returnData()}
      </div>
    </div>
  );
}

NssfAndTin.propTypes = {
  token: PropTypes.string
};

export default connect(mapStateToProps)(NssfAndTin);
