import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap';
import { IoMdSettings } from 'react-icons/io';
import { IconContext } from 'react-icons';

export default function ManageLeaveModal() {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  return (
    <div>
      <span
        onClick={toggle}
        className="pointerCursor">
        <IconContext.Provider value={{ size: '2em' }}>
          <IoMdSettings />
        </IconContext.Provider>
      </span>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Manage Leave</ModalHeader>
        <ModalBody>
          abc xyz
        </ModalBody>
      </Modal>
    </div>
  );
}
