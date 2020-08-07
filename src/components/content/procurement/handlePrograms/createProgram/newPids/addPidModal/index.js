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

const AddPidModal = ({
  addOnePid,
  edit,
  pidToEdit,
  editPid
}) => {
  const [modal, setModal] = useState(false);
  const [pid, setPid] = useState(
    (edit && pidToEdit && pidToEdit.pid) ? pidToEdit.pid : ''
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
    if (name === 'pid') {
      setPid(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (edit) {
      editPid(pid, pidToEdit.index);
      setSuccessMessage(`${pid} editted successfully`);
    } else {
      addOnePid(pid);
      setSuccessMessage(`${pid} added successfully`);
      setPid('');
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
          Add PID
      </button>
    );
  };

  return (
    <div className="inlineItem push-button-left">
      {returnICon()}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          { edit ? 'Edit PID' : 'Add PID'}
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
                  <InputGroupText>PID</InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="PID"
                  type="text"
                  name="pid"
                  value={pid}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </FormGroup>

            <div className="mt-5">
              <button className='pointerCursor float-right nextButton' type='submit'>
                { edit ? 'Edit PID' : 'Add PID' }
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

AddPidModal.propTypes = {
  addOnePid: PropTypes.func,
  edit: PropTypes.bool,
  pidToEdit: PropTypes.object,
  editPid: PropTypes.func
};

export default AddPidModal;
