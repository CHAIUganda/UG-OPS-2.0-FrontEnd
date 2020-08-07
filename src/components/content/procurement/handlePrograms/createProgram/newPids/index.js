import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import AddPidModal from './addPidModal';

import Icon from '../../../../../common/icon';

function AddPids({
  newPids,
  setNewPids,
  setCurrentComponent
}) {
  const [pids, setPids] = useState(newPids || []);

  const editPid = (newPidDetails, indexOfPid) => {
    const arr = [...pids];
    arr.splice(indexOfPid, 1, newPidDetails);
    setPids(arr);
  };

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
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody>
          {
            pids.map((p, index) => (
              <tr key={index}>
                <td scope="row">{index + 1}</td>
                <td>{p}</td>
                <td>
                  <AddPidModal
                    edit={true}
                    pidToEdit={{
                      pid: p,
                      index
                    }}
                    editPid={editPid}
                  />
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

  const changePage = (page) => {
    setNewPids(pids);
    setCurrentComponent(page);
  };

  return (
    <div>
      <div className="m-4">
        <h4 className="inlineItem">Add PIDs</h4>
        <span>
          <AddPidModal
            addOnePid={addOnePid}
            edit={false}
          />
        </span>
      </div>
      {returnTable()}
      <div className="pushChildToBottomPrograms m-5">
        <button className='pointerCursor float-left nextButton'
          onClick={
            (event) => {
              event.preventDefault();
              changePage(0);
            }
          }
        >
          <Icon
            Icon2Render={IoIosArrowBack}
            color={'#003366'}
          />
            Back
        </button>

        <button className='pointerCursor float-right nextButton'
          onClick={
            (event) => {
              event.preventDefault();
              changePage(2);
            }
          }
        >
            Next
          <Icon
            Icon2Render={IoIosArrowForward}
            color={'#003366'}
          />
        </button>
      </div>
    </div>
  );
}

AddPids.propTypes = {
  newPids: PropTypes.array,
  setCurrentComponent: PropTypes.func,
  setNewPids: PropTypes.func
};

export default AddPids;
