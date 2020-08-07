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
import { IoMdAdd, IoIosArrowForward } from 'react-icons/io';
import { IconContext } from 'react-icons';
import PropTypes from 'prop-types';

import Icon from '../../../../../../common/icon';

const AddPidModal = ({
  addOnePid
}) => {
  const [modal, setModal] = useState(false);
  const [pid, setPid] = useState('');
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
    addOnePid(pid);
    setSuccessMessage(`${pid} added successfully`);
    setPid('');
  };

  return (
    <div className="inlineItem push-button-left">
      <button onClick={toggle} className="submitButton positionBtn">
        <IconContext.Provider value={{ size: '1em' }}>
          <IoMdAdd />
        </IconContext.Provider>
          Add PID
      </button>
      {/* <span className="float-right mr-3 forceColor" onClick={toggle}>
        <IconContext.Provider value={{ size: '1em' }}>
          <IoMdAdd />
        </IconContext.Provider>
          Add PID
      </span> */}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Add PID</ModalHeader>
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
                Add PID
                <Icon
                  Icon2Render={IoIosArrowForward}
                  color={'#003366'}
                />
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
  addOnePid: PropTypes.func
};

export default AddPidModal;
