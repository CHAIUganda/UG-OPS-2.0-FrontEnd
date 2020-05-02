import React, { useState, useEffect } from 'react';
import { Spinner } from 'reactstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as sideBarActions from '../../../../../redux/actions/sideBarActions';
import { BASE_URL } from '../../../../../config';
import CreateNewPublicHoliday from './createPublicHolidayModal';
import './publicHolidays.css';

const matchDispatchToProps = {
  changeSection: sideBarActions.changeSection,
  changeActive: sideBarActions.changeActive
};

const mapStateToProps = (state) => ({
  roles: state.auth.roles,
});

function ManagePublicHolidays({
  roles,
  changeSection,
  changeActive
}) {
  const { hr, admin } = roles;
  const [publicHolidays, setPublicHolidays] = useState([]);
  const [tableSpinner, setTableSpinner] = useState(false);
  const [tableError, setTableError] = useState('');

  changeSection('Human Resource');
  changeActive('ManagePublicHolidays');

  const handleDeleteHoliday = (event, id) => {
    event.preventDefault();
    // eslint-disable-next-line no-param-reassign
    event.currentTarget.className = 'disappear';
    const endPoint = `${BASE_URL}hrApi/removePublicHoliday`;
    const holiday = { id };

    axios.post(endPoint, holiday)
      .then(() => {
        const newHolidays = publicHolidays.filter((hol) => hol._id !== id);
        setPublicHolidays(newHolidays);
      })
      .catch((err) => {
        if (err && err.response && err.response.data && err.response.data.message) {
          setTableError(err.response.data.message);
        } else {
          setTableError(err.message);
        }
      });
  };


  const returnTable = () => {
    if (tableError) {
      return <div className="errorFeedback">{ tableError }</div>;
    }

    if (tableSpinner) {
      return <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />;
    }

    return (
      <table className="table holidaysTable">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Holiday</th>
            <th scope="col">Date</th>
            {(hr || admin)
              && <th scope="col">Manage</th>
            }
          </tr>
        </thead>
        <tbody>
          {
            publicHolidays.map((holiday, index) => (
              <tr key={holiday._id}>
                <th scope="row">{index + 1}</th>
                <td>{holiday.name}</td>
                <td>{new Date(`${new Date().getFullYear()}-${holiday.date.split('/')[1]}-${holiday.date.split('/')[0]}`).toDateString()}</td>
                {(hr || admin)
              && <td>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={(event) => handleDeleteHoliday(event, holiday._id)}>
                    Delete
                </button>
              </td>
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  };

  const updatePHolidayArray = (newHoliday) => {
    setPublicHolidays([...publicHolidays, newHoliday]);
  };

  useEffect(() => {
    setTableSpinner(true);
    const endPoint = `${BASE_URL}hrApi/getPublicHolidays`;
    axios.get(endPoint)
      .then((res) => {
        setTableSpinner(false);
        setPublicHolidays(res.data);
      })
      .catch((err) => {
        setTableSpinner(false);
        if (err && err.response && err.response.data && err.response.data.message) {
          setTableError(err.response.data.message);
        } else {
          setTableError(err.message);
        }
      });
  }, []);

  return (
    <div>
      <div>
        <h2 className="inlineItem">Public Holidays</h2>
        { (hr || admin)
          && <CreateNewPublicHoliday onNewPHoliday={updatePHolidayArray} />
        }
      </div>
      {returnTable()}
    </div>
  );
}


ManagePublicHolidays.propTypes = {
  roles: PropTypes.object,
  changeSection: PropTypes.func,
  changeActive: PropTypes.func
};

export default connect(mapStateToProps, matchDispatchToProps)(ManagePublicHolidays);
