import React from 'react';
import { FaWindowClose } from 'react-icons/fa';
import PropTypes from 'prop-types';

import Icon from '../icon';
import './filterNameButton.css';


export default function FilterNameButton({ person, removePerson }) {
  if (!person) {
    return (
      <span className="nameButton">
        No person passed!
      </span>
    );
  }

  if (!removePerson) {
    return (
      <span className="nameButton">
        No removePerson passed!
      </span>
    );
  }

  return (
    <span className="nameButton">
      {
        person.label
          ? person.label
          : 'No name passed'
      }
      <span className="closeButton" onClick={() => removePerson(person.value)}>
        <Icon
          color={'red'}
          size={'1.3em'}
          Icon2Render={FaWindowClose}
        />
      </span>
    </span>
  );
}

FilterNameButton.propTypes = {
  person: PropTypes.object,
  removePerson: PropTypes
};
