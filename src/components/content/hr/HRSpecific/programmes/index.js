import React, { useState, useEffect } from 'react';
// prettier-ignore
import {
  Spinner,
} from 'reactstrap';
import axios from 'axios';

import { BASE_URL } from '../../../../../config';
import CreateNewProgramme from './createProgrammeModal';
import './programmes.css';

export default function ManageProgrammes() {
  const [programmes, setProgrammes] = useState([]);
  const [tableSpinner, setTableSpinner] = useState(false);
  const [tableError, setTableError] = useState('');

  const handleprogramme = (event, name) => {
    event.preventDefault();
    // eslint-disable-next-line no-param-reassign
    event.currentTarget.className = 'disappear';
    const endPoint = `${BASE_URL}hrApi/removeProgram`;
    const programme = { name };

    axios.post(endPoint, programme)
      .then(() => {
        const newProgrammes = programmes.filter((prog) => prog.name !== name);
        setProgrammes(newProgrammes);
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
            <th scope="col">programme</th>
            <th scope="col">PM</th>
            <th scope="col">Manage</th>
          </tr>
        </thead>
        <tbody>
          {
            programmes.map((prog, index) => (
              <tr key={prog._id}>
                <th scope="row">{index + 1}</th>
                <td>{prog.name}</td>
                <td>{`${prog.programManagerDetails.fName} ${prog.programManagerDetails.lName}`}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={(event) => handleprogramme(event, prog.name)}>
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

  const updateProgrammesArray = (newHoliday) => {
    setProgrammes([...programmes, newHoliday]);
  };

  useEffect(() => {
    setTableSpinner(true);
    const endPoint = `${BASE_URL}hrApi/getPrograms`;
    axios.get(endPoint)
      .then((res) => {
        setTableSpinner(false);
        setProgrammes(res.data);
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
        <h2 className="inlineItem">CHAI Programmes</h2>
        <CreateNewProgramme
          onNewProgramme={updateProgrammesArray}
        />
      </div>
      {returnTable()}
    </div>
  );
}
