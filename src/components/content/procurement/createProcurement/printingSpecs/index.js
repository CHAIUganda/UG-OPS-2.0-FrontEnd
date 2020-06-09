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
  // setPrintingSpecs,
}) => {
  const [printingSpecError, setPrintingSpecError] = useState('');
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

    return <></>;
  };

  return (
    <>
      <div>
        <h3 className="inlineItem">Printing, Art and Design Specifications</h3>
        <AddPrintingSpec />
        {printingSpecError && <div className="errorFeedback m-3"> {printingSpecError} </div>}
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
