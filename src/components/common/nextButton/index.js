import React from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import PropTypes from 'prop-types';

import Icon from '../icon';

import './nextButton.css';

const NextButton = ({
  setCurrentComponent,
  activeSections,
  currentComponent,
  errorProps,
  finish
}) => {
  const handleClick = (event) => {
    event.preventDefault();
    if (errorProps && errorProps.length > 0) {
      errorProps.forEach((e) => {
        e.setter(e.err);
      });
      return;
    }

    if (finish) {
      setCurrentComponent(['finish']);
      return;
    }

    const currentIndex = activeSections.indexOf(currentComponent[0]);
    if (currentIndex !== -1 && currentIndex < activeSections.length) {
      setCurrentComponent([activeSections[currentIndex + 1]]);
    }
  };

  return (
    <span className='pointerCursor float-right nextButton' onClick={handleClick}>
      {finish ? 'Finish' : 'Next'}
      <Icon
        Icon2Render={IoIosArrowForward}
        color={'#003366'}
      />
    </span>
  );
};

NextButton.propTypes = {
  setCurrentComponent: PropTypes.func,
  setActiveSections: PropTypes.func,
  currentComponent: PropTypes.object,
  activeSections: PropTypes.array,
  errorProps: PropTypes.array,
  finish: PropTypes.bool
};

export default NextButton;
