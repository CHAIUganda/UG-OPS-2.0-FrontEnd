import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import AddObjectiveCodeModal from './addObjectiveCodeModal';

import Icon from '../../../../../common/icon';

function AddObjectiveCodes({
  newObjectiveCodes,
  setCurrentComponent,
  setNewObjectiveCodes
}) {
  const [objectiveCodes, setObjetiveCodes] = useState(newObjectiveCodes || []);

  const editObjectiveCode = (newObjectiveCodeDetails, indexOfObjectiveCode) => {
    const arr = [...objectiveCodes];
    arr.splice(indexOfObjectiveCode, 1, newObjectiveCodeDetails);
    setObjetiveCodes(arr);
  };

  const returnTable = () => {
    if (objectiveCodes.length < 1) {
      return (
        <div className="alert alert-info" role="alert">
          No objective codes so far.
        </div>
      );
    }

    return (
      <table className="table holidaysTable">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Objetive Code</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody>
          {
            objectiveCodes.map((o, index) => (
              <tr key={index}>
                <td scope="row">{index + 1}</td>
                <td>{o}</td>
                <td>
                  <AddObjectiveCodeModal
                    edit={true}
                    objectiveCodeToEdit={{
                      objectiveCode: o,
                      index
                    }}
                    editObjectiveCode={editObjectiveCode}
                  />
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  };

  const addOneObjectiveCode = (objectiveCodeToAdd) => {
    const arr = [...objectiveCodes, objectiveCodeToAdd];
    setObjetiveCodes(arr);
  };

  const changePage = (page) => {
    setNewObjectiveCodes(objectiveCodes);
    setCurrentComponent(page);
  };

  return (
    <div>
      <div className="m-4">
        <div className="inlineItem objectiveHeading"><span className="objheadingSize">Add Objective Codes</span>
          <span className="objButtonPosition">
            <AddObjectiveCodeModal
              addOneObjectiveCode={addOneObjectiveCode}
              edit={false}
            />
          </span>
        </div>
      </div>
      {returnTable()}
      <div className="pushChildToBottomPrograms m-5">
        <button className='pointerCursor float-left nextButton'
          onClick={
            (event) => {
              event.preventDefault();
              changePage(2);
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
              changePage(4);
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

AddObjectiveCodes.propTypes = {
  newObjectiveCodes: PropTypes.array,
  setCurrentComponent: PropTypes.func,
  setNewObjectiveCodes: PropTypes.func
};

export default AddObjectiveCodes;
