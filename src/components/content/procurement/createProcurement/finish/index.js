import React from 'react';
import PropTypes from 'prop-types';

import BackButton from '../../../../common/backButton';

const FinishCreateProcurement = ({
  setCurrentComponent,
  activeSections,
  currentComponent,
}) => {
  return (
    <>
      <div>
        <h3>Look Through Your Procurement Request.</h3>
      </div>
      <div className='pushChildToBottom mb-2'>
        <BackButton
          activeSections={activeSections}
          currentComponent={currentComponent}
          setCurrentComponent={setCurrentComponent}
        />
      </div>
    </>
  );
};

FinishCreateProcurement.propTypes = {
  setCurrentComponent: PropTypes.func,
  activeSections: PropTypes.array,
  currentComponent: PropTypes.array,
};

export default FinishCreateProcurement;
