import React, { useState } from 'react';
import PropTypes from 'prop-types';

import NextButton from '../../../../common/nextButton';
import BackButton from '../../../../common/backButton';
import AddPrintingSpec from './addPrintingSpec';

import 'dropzone/dist/dropzone.css';

const PrintingSpecs = ({
  // setSuccessFeedback,
  // setError,
  setCurrentComponent,
  activeSections,
  currentComponent,
  printingSpecs,
  setPrintingSpecs,
}) => {
  const [printingSpecError, setPrintingSpecError] = useState('');
  const [printingSpecSucc, setPrintingSpecSucc] = useState('');

  const addSpec = (newSpec) => {
    const newArr = printingSpecs.concat([newSpec]);
    setPrintingSpecSucc(`${newSpec.specTitle} added successfully.`);
    setPrintingSpecs(newArr);
  };

  const editSpec = (position, newSpec) => {
    const newArr = [...printingSpecs];
    newArr.splice(position, 1, newSpec);
    setPrintingSpecSucc(`${newSpec.specTitle} editted successfully.`);
    setPrintingSpecs(newArr);
  };

  const errorProps = () => {
    const arr = [];
    if (printingSpecs.length < 1) {
      arr.push({
        err: 'Please add atleast a specification to continue.',
        setter: setPrintingSpecError
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

  const returnTableData = () => {
    if (printingSpecs.length < 1) {
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
          {
            printingSpecs.map((spec, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{spec.specTitle}</td>
                <td>
                  <AddPrintingSpec
                    edit={true}
                    specToEdit={spec}
                    editSpec={editSpec}
                    position={index}
                  />
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  };

  return (
    <>
      <div>
        <h3 className="inlineItem">Printing, Art and Design Specifications</h3>
        <AddPrintingSpec
          addSpec={addSpec}
          edit={false}
        />
        {printingSpecError && <div className="errorFeedback m-3"> {printingSpecError} </div>}
        { printingSpecSucc
          && <div className="alert alert-success m-3" role="alert">
            { printingSpecSucc }
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

PrintingSpecs.propTypes = {
  setSuccessFeedback: PropTypes.func,
  setCurrentComponent: PropTypes.func,
  activeSections: PropTypes.array,
  currentComponent: PropTypes.array,
  printingSpecs: PropTypes.array,
  setPrintingSpecs: PropTypes.func,
};

export default PrintingSpecs;
