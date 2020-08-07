import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiEdit } from 'react-icons/fi';
import { IconContext } from 'react-icons';

import AddPidModal from './addPidModal';

function AddPids({
  newPids
}) {
  const [pids, setPids] = useState(newPids || []);

  const returnTable = () => {
    if (pids.length < 1) {
      return (
        <div className="alert alert-info" role="alert">
          No PIDS so far.
        </div>
      );
    }

    return (
      <table className="table holidaysTable">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">PID</th>
          </tr>
        </thead>
        <tbody>
          {
            pids.map((p, index) => (
              <tr key={index}>
                <td scope="row">{index + 1}</td>
                <td>{p}</td>
                <td>
                  <IconContext.Provider value={{ size: '2em' }}>
                    <FiEdit />
                  </IconContext.Provider>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  };

  const addOnePid = (pidToAdd) => {
    const arr = [...pids, pidToAdd];
    setPids(arr);
  };

  return (
    <div>
      <div className="m-4">
        <h4 className="inlineItem">Add PIDs</h4>
        <span>
          <AddPidModal
            addOnePid={addOnePid}
          />
        </span>
      </div>
      {returnTable()}
    </div>
  );
}

AddPids.propTypes = {
  newPids: PropTypes.array
};

export default AddPids;
