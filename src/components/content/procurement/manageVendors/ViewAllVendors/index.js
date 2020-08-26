import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Link } from 'react-router-dom';

import CommonSpinner from '../../../../common/spinner';

import { BASE_URL } from '../../../../../config';
import * as sideBarActions from '../../../../../redux/actions/sideBarActions';
import * as authActions from '../../../../../redux/actions/authActions';


const mapStateToProps = (state) => ({
  token: state.auth.token,
  roles: state.auth.roles
});

const mapDispatchToProps = {
  changeSection: sideBarActions.changeSection,
  changeActive: sideBarActions.changeActive,
  logUserOut: authActions.logUserOut
};

export const AllVendors = ({
  token,
  roles,
  changeSection,
  changeActive,
  logUserOut
}) => {
  // Check for roles

  if (token && roles) {
    if (!roles.chaiProcurement && !roles.admin) {
      return (
        <div className="alert alert-danger text-center" role="alert">
          <p>{'FE: You have no access rights for this resource.'}</p>
        </div>
      );
    }
  }

  const [spinner, setSpinner] = useState(false);
  const [loadingPageErr, setLoadingPageErr] = useState('');
  const [allVendors, setAllVendors] = useState([]);

  changeSection('Procurement');
  changeActive('ViewAllVendors');

  const setUpThisPage = () => {
    const endPoint = `${BASE_URL}procurementApi/getVendors`;
    axios.defaults.headers.common = { token };
    axios.get(endPoint)
      .then((res) => {
        setAllVendors(res.data);
        setSpinner(false);
      })
      .catch((err) => {
        setSpinner(false);

        if (err && err.response && err.response.status && err.response.status === 401) {
          Cookies.remove('token');
          logUserOut();
        }

        if (err && err.response && err.response.data && err.response.data.message) {
          setLoadingPageErr(err.response.data.message);
        } else {
          setLoadingPageErr(err.message);
        }
      });
  };

  useEffect(() => {
    setSpinner(true);
    setLoadingPageErr('');

    if (token) {
      setUpThisPage();
    } else {
      Cookies.remove('token');
      logUserOut();
    }
  }, []);

  if (loadingPageErr) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        <p>{loadingPageErr}</p>
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

  const returnTable = () => {
    if (allVendors.length < 1) {
      return (
        <div className="alert alert-info m-4" role="alert">
          No vendor has been registered yet.
        </div>
      );
    }

    return (
      <table className="table holidaysTable">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Vendor Email</th>
            <th scope="col">Vendor Tin</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {
            allVendors.map((v, index) => (
              <tr key={v._id}>
                <td>{index + 1}</td>
                <td>{v.name}</td>
                <td>{v.vendorEmail}</td>
                <td>{v.vendorTin}</td>
                <td>
                  <Link
                    to={{
                      pathname: '/procurement/AddVendor',
                      propx: v,
                      propsPassed: true
                    }}
                  >
                    <button className="btn btn-outline-primary">Edit</button>
                  </Link>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h2>View All Vendors</h2>
      {returnTable()}
    </div>
  );
};

AllVendors.propTypes = {
  token: PropTypes.string,
  roles: PropTypes.object,
  changeSection: PropTypes.func,
  changeActive: PropTypes.func,
  logUserOut: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AllVendors);
