import React, { useState, useEffect } from 'react';
// prettier-ignore
import {
  Spinner,
} from 'reactstrap';
import axios from 'axios';

import { BASE_URL } from '../../../../../config';
import CreateNewPublicHoliday from '../createPublicHolidayModal';
import './publicHolidays.css';

export default function ManagePublicHolidays() {
  const [publicHolidays, setPublicHolidays] = useState([]);
  const [tableSpinner, setTableSpinner] = useState(false);
  const [tableError, setTableError] = useState('');

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
            <th scope="col">Name</th>
            <th scope="col">Date(DD/MM)</th>
            <th scope="col">Manage</th>
          </tr>
        </thead>
        <tbody>
          {
            publicHolidays.map((holiday, index) => (
              <tr key={holiday._id}>
                <th scope="row">{index + 1}</th>
                <td>{holiday.name}</td>
                <td>{holiday.date}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={(event) => handleDeleteHoliday(event, holiday._id)}>
                    Delete
                  </button>
                </td>
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
        <h2 className="inlineItem">Manage Public Holidays</h2>
        <CreateNewPublicHoliday onNewPHoliday={updatePHolidayArray} />
      </div>
      {returnTable()}
    </div>
  );
}
