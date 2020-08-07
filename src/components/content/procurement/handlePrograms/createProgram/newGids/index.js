import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import AddGidModal from './addGidModal';

import Icon from '../../../../../common/icon';

function AddGids({
  newGids,
  setCurrentComponent
}) {
  const [gids, setGids] = useState(newGids || []);

  const editGid = (newGidDetails, indexOfGid) => {
    const arr = [...gids];
    arr.splice(indexOfGid, 1, newGidDetails);
    setGids(arr);
  };

  const returnTable = () => {
    if (gids.length < 1) {
      return (
        <div className="alert alert-info" role="alert">
          No GIDS so far.
        </div>
      );
    }

    return (
      <table className="table holidaysTable">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">GID</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody>
          {
            gids.map((g, index) => (
              <tr key={index}>
                <td scope="row">{index + 1}</td>
                <td>{g}</td>
                <td>
                  <AddGidModal
                    edit={true}
                    gidToEdit={{
                      gid: g,
                      index
                    }}
                    editGid={editGid}
                  />
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  };

  const addOneGid = (gidToAdd) => {
    const arr = [...gids, gidToAdd];
    setGids(arr);
  };

  const changePage = (page) => {
    setCurrentComponent(page);
  };

  return (
    <div>
      <div className="m-4">
        <h4 className="inlineItem">Add GIDs</h4>
        <span>
          <AddGidModal
            addOneGid={addOneGid}
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
              changePage(1);
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
              changePage(3);
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

AddGids.propTypes = {
  newGids: PropTypes.array,
  setCurrentComponent: PropTypes.func
};

export default AddGids;
