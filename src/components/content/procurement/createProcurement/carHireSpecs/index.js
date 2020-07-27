import React, { useState } from 'react';
import PropTypes from 'prop-types';

import 'dropzone/dist/dropzone.css';
import 'rc-time-picker/assets/index.css';

import NextButton from '../../../../common/nextButton';
import BackButton from '../../../../common/backButton';
import AddCarHireSpec from './addCarHireSpec';

const CarHireSpecifications = ({
  setCurrentComponent,
  activeSections,
  currentComponent,
  carHireSpecs,
  setCarHireSpecs
}) => {
  const [carHireSpecsError, setCarHireSpecsError] = useState('');
  const [carHireSpecsSucc, setCarHireSpecsSucc] = useState('');

  const addSpec = (newSpec) => {
    const newArr = carHireSpecs.concat([newSpec]);
    setCarHireSpecsError('');
    setCarHireSpecsSucc(`${newSpec.specTitle} added successfully.`);
    setCarHireSpecs(newArr);
  };

  const editSpec = (position, newSpec) => {
    const newArr = [...carHireSpecs];
    newArr.splice(position, 1, newSpec);
    setCarHireSpecsError('');
    setCarHireSpecsSucc(`${newSpec.specTitle} editted successfully.`);
    setCarHireSpecs(newArr);
  };

  const errorProps = () => {
    const arr = [];
    if (carHireSpecs.length < 1) {
      arr.push({
        err: 'Please add atleast a specification to continue.',
        setter: setCarHireSpecsError
      });
    }

    return arr;
  };

  const returnNextButton = () => {
    const currentIndex = activeSections.indexOf(currentComponent[0]);
    if (currentIndex !== -1 && currentIndex < activeSections.length) {
      if (currentIndex === activeSections.length - 1) {
        return (
          <NextButton
            finish={true}
            setCurrentComponent={setCurrentComponent}
            // activeSections={activeSections}
            // currentComponent={currentComponent}
            errorProps={errorProps()}
          />
        );
      }
      return (
        <NextButton
          activeSections={activeSections}
          currentComponent={currentComponent}
          setCurrentComponent={setCurrentComponent}
          errorProps={errorProps()}
        />
      );
    }

    return <></>;
  };

  const carHireSpecComponent = () => {
    return carHireSpecs.map((spec, index) => {
      const x = spec.additionalDocumentations;
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{spec.specTitle}</td>
          <td>
            <AddCarHireSpec
              edit={true}
              specToEdit={spec}
              editSpec={editSpec}
              position={index}
              x={x}
            />
          </td>
        </tr>
      );
    });
  };

  const returnTableData = () => {
    if (carHireSpecs.length < 1) {
      return (
        <div className="alert alert-info mt-5" role="alert">
          You haven&apos;t added any specifications yet.
        </div>
      );
    }

    return (
      <table className="table holidaysTable">
        <thead>
          <tr>
            <th scope="col">No.</th>
            <th scope="col">Title</th>
            <th scope="col">Manage</th>
          </tr>
        </thead>
        <tbody>
          {carHireSpecComponent()}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <div>
        <h3 className="inlineItem">Car Hire Specifications</h3>
        <AddCarHireSpec
          addSpec={addSpec}
          edit={false}
        />
        {carHireSpecsError && <div className="errorFeedback m-3"> {carHireSpecsError} </div>}
        { carHireSpecsSucc
          && <div className="alert alert-success m-3" role="alert">
            { carHireSpecsSucc }
          </div>
        }
        {returnTableData()}
      </div>

      <div className='pushChildToBottom mb-2'>
        <BackButton
          activeSections={activeSections}
          currentComponent={currentComponent}
          setCurrentComponent={setCurrentComponent}
        />
        {returnNextButton()}
      </div>
    </>
  );
};

CarHireSpecifications.propTypes = {
  setCurrentComponent: PropTypes.func,
  activeSections: PropTypes.array,
  currentComponent: PropTypes.array,
  carHireSpecs: PropTypes.array,
  setCarHireSpecs: PropTypes.func
};

export default CarHireSpecifications;
