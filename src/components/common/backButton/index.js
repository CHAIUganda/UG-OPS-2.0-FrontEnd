import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';

import Icon from '../icon';

const BackButton = () => (
  <span className='pointerCursor float-left nextButton'>
      Back
    <Icon
      Icon2Render={IoIosArrowBack}
      color={'#003366'}
    />
  </span>
);

export default BackButton;
