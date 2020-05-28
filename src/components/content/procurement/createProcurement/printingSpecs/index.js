import React from 'react';
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
}) => {
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
          // errorProps={errorProps()}
          />
        );
      }
      return (
        <NextButton
          activeSections={activeSections}
          currentComponent={currentComponent}
          setCurrentComponent={setCurrentComponent}
          // errorProps={errorProps()}
        />
      );
    }

    return <></>;
  };


  return (
    <>
      <div>
        <h3 className="inlineItem">Printing, Art and Design Specifications</h3>
        <AddPrintingSpec />
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
  setError: PropTypes.func,
  setCurrentComponent: PropTypes.func,
  activeSections: PropTypes.array,
  currentComponent: PropTypes.array,
};

export default PrintingSpecs;
