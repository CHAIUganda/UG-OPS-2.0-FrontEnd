import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import Cookies from 'js-cookie';

import { BASE_URL } from '../../../../config';

import * as sideBarActions from '../../../../redux/actions/sideBarActions';
import * as authActions from '../../../../redux/actions/authActions';

import CreateNewAccountCode from './createAccCodeModal';
import CommonSpinner from '../../../common/spinner';

const mapStateToProps = (state) => ({
  token: state.auth.token,
  roles: state.auth.roles
});

const mapDispatchToProps = {
  changeSection: sideBarActions.changeSection,
  changeActive: sideBarActions.changeActive,
  logUserOut: authActions.logUserOut
};

export const HandleAccountCodes = ({
  changeSection,
  changeActive,
  token,
  logUserOut,
  roles
}) => {
  // Check for roles

  if (token && roles) {
    if (!roles.financeAdmin && !roles.admin) {
      return (
        <div className="alert alert-danger text-center" role="alert">
          <p>{'FE: You have no access rights for this resource.'}</p>
        </div>
      );
    }
  }

  const [spinner, setSpinner] = useState(false);
  const [loadingPageErr, setLoadingPageErr] = useState('');
  const [allAccountCodes, setAllAccountCodes] = useState([]);

  changeSection('Procurement');
  changeActive('ManageAccountCodes');

  const setUpThisPage = () => {
    // set this page up. Do stuff like pick all programs.

    axios.defaults.headers.common = { token };
    const apiRoute = `${BASE_URL}financeApi/getAccounts/all`;
    axios.get(apiRoute)
      . then((res) => {
        setSpinner(false);
        setAllAccountCodes(res.data);
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

  const editArrayOfAccs = (codeObj) => {
    const codeId = codeObj._id;
    const codeIndex = allAccountCodes.findIndex((c) => c._id === codeId);

    if (codeIndex !== -1) {
      const arr = [...allAccountCodes];
      arr.splice(codeIndex, 1, codeObj);
      setAllAccountCodes(arr);
    }
  };

  const returnTableOFAccountCodes = () => {
    if (allAccountCodes.length < 1) {
      return (
        <div className="alert alert-primary" role="alert">
          No account codes have been added as of now.
        </div>
      );
    }

    const handleStatusColors = (status) => {
      if (status.toLowerCase() === 'active') {
        return 'bg-success text-white';
      }

      if (status.toLowerCase() === 'archived') {
        return 'bg-warning text-dark';
      }

      return '';
    };

    return (
      <table className="table holidaysTable">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Account Code</th>
            <th scope="col">Grouping</th>
            <th scope="col">Status</th>
            <th scope="col">short description</th>
          </tr>
        </thead>
        <tbody>
          {
            allAccountCodes.map((code, index) => (
              <tr key={code._id}>
                <td scope="row">{index + 1}</td>
                <td>{code.accountCode}</td>
                <td>{code.financialGrouping}</td>
                <td
                  className={handleStatusColors(code.status)}
                >
                  {code.status}
                </td>
                <td>{code.useDecsription}</td>
                <td>
                  <CreateNewAccountCode
                    edit={true}
                    accCode={code}
                    editArrayOfAccs={editArrayOfAccs}
                  />
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  };

  const updateAccCodessArray = (newAccCode) => {
    setAllAccountCodes([...allAccountCodes, newAccCode]);
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="inlineItem">Manage Account codes</h1>
        <CreateNewAccountCode
          updateAccCodessArray={updateAccCodessArray}
          edit={false}
        />
      </div>

      {returnTableOFAccountCodes()}
    </div>
  );
};

HandleAccountCodes.propTypes = {
  token: PropTypes.string,
  email: PropTypes.string,
  changeSection: PropTypes.func,
  changeActive: PropTypes.func,
  setInitialNotifications: PropTypes.func,
  logUserIn: PropTypes.func,
  roles: PropTypes.object,
  logUserOut: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(HandleAccountCodes);
