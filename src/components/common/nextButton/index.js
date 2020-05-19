import React from 'react';
import { IoIosArrowForward } from 'react-icons/io';

import Icon from '../icon';

import './nextButton.css';

const NextButton = () => (
  <span className='pointerCursor float-right nextButton'>
      Next
    <Icon
      Icon2Render={IoIosArrowForward}
      color={'#003366'}
    />
  </span>
);

export default NextButton;
