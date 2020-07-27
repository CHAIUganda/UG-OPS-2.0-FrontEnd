import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import PropTypes from 'prop-types';

import Icon from '../icon';

const BackButton = ({
  activeSections,
  currentComponent,
  setCurrentComponent
}) => {
  const handleClick = (event) => {
    event.preventDefault();
    if (currentComponent[0] === 'finish') {
      const nextIndex = activeSections.length - 1;
      const element = activeSections[nextIndex];
      setCurrentComponent([element]);
      return;
    }

    const currentIndex = activeSections.indexOf(currentComponent[0]);
    if (currentIndex !== -1 && currentIndex < activeSections.length) {
      setCurrentComponent([activeSections[currentIndex - 1]]);
    }
  };

  return (
    <span className='pointerCursor float-left nextButton' onClick={handleClick}>
      <Icon
        Icon2Render={IoIosArrowBack}
        color={'#003366'}
      />
    Back
    </span>
  );
};

BackButton.propTypes = {
  setCurrentComponent: PropTypes.func,
  currentComponent: PropTypes.object,
  activeSections: PropTypes.array,
};

export default BackButton;
