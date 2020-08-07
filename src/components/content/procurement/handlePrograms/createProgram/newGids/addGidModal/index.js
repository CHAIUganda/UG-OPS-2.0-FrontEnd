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
  addOneGid,
  edit,
  gidToEdit,
  editGid
}) => {
  const [modal, setModal] = useState(false);
  const [gid, setGid] = useState(
    (edit && gidToEdit && gidToEdit.gid) ? gidToEdit.gid : ''
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
    if (name === 'gid') {
      setGid(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (edit) {
      editGid(gid, gidToEdit.index);
      setSuccessMessage(`${gid} editted successfully`);
    } else {
      addOneGid(gid);
      setSuccessMessage(`${gid} added successfully`);
      setGid('');
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
          Add GID
      </button>
    );
  };

  return (
    <div className="inlineItem push-button-left">
      {returnICon()}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          { edit ? 'Edit GID' : 'Add GID'}
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
                  <InputGroupText>GID</InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="GID"
                  type="text"
                  name="gid"
                  value={gid}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </FormGroup>

            <div className="mt-5">
              <button className='pointerCursor float-right nextButton' type='submit'>
                { edit ? 'Edit GID' : 'Add GID' }
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
  addOneGid: PropTypes.func,
  edit: PropTypes.bool,
  gidToEdit: PropTypes.object,
  editGid: PropTypes.func
};

export default AddGidModal;
