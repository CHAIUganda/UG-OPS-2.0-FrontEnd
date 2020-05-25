import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';

import Icon from '../icon';

const BackButton = () => (
  <span className='pointerCursor float-left nextButton'>
    <Icon
      Icon2Render={IoIosArrowBack}
      color={'#003366'}
    />
    Back
  </span>
);

export default BackButton;
