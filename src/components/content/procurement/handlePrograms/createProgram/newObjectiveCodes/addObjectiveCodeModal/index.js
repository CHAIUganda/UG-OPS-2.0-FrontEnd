import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input
} from 'reactstrap';
import { IoMdAdd } from 'react-icons/io';
import { FiEdit } from 'react-icons/fi';
import { IconContext } from 'react-icons';
import PropTypes from 'prop-types';

const AddGidModal = ({
  addOneObjectiveCode,
  edit,
  objectiveCodeToEdit,
  editObjectiveCode
}) => {
  debugger;
  const [modal, setModal] = useState(false);
  const [objectiveCode, setObjectiveCode] = useState(
    (edit && objectiveCodeToEdit && objectiveCodeToEdit.objectiveCode) ? objectiveCodeToEdit.objectiveCode : ''
  );
  const [successMessage, setSuccessMessage] = useState('');

  const toggle = (event) => {
    event.preventDefault();
    setModal(!modal);
  };

  const handleChange = (event) => {
    event.preventDefault();
    setSuccessMessage('');

    const { name, value } = event.target;
    if (name === 'objectiveCode') {
      setObjectiveCode(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (edit) {
      editObjectiveCode(objectiveCode, objectiveCodeToEdit.index);
      setSuccessMessage(`${objectiveCode} editted successfully`);
    } else {
      addOneObjectiveCode(objectiveCode);
      setSuccessMessage(`${objectiveCode} added successfully`);
      setObjectiveCode('');
    }
  };

  const returnICon = () => {
    if (edit) {
      return (
        <span onClick={toggle} className="pointerCursor">
          <IconContext.Provider value={{ size: '2em' }}>
            <FiEdit />
          </IconContext.Provider>
        </span>
      );
    }
    return (
      <button onClick={toggle} className="submitButton positionBtn">
        <IconContext.Provider value={{ size: '1em' }}>
          <IoMdAdd />
        </IconContext.Provider>
          Add Objective Code
      </button>
    );
  };

  return (
    <div className="inlineItem push-button-left">
      {returnICon()}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          { edit ? 'Edit Objective Code' : 'Add Objective Code'}
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            {
              successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )
            }
            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Objective Code</InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Objective Code"
                  type="text"
                  name="objectiveCode"
                  value={objectiveCode}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </FormGroup>

            <div className="mt-5">
              <button className='pointerCursor float-right nextButton' type='submit'>
                { edit ? 'Edit objective Code' : 'Add Objective Code' }
              </button>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle} className="float-left">Close</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

AddGidModal.propTypes = {
  addOneObjectiveCode: PropTypes.func,
  edit: PropTypes.bool,
  objectiveCodeToEdit: PropTypes.object,
  editObjectiveCode: PropTypes.func
};

export default AddGidModal;
