import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  CustomInput
} from 'reactstrap';
import { IoMdSettings } from 'react-icons/io';
import { IconContext } from 'react-icons';
import PropTypes from 'prop-types';

import CommonSpinner from '../../../../common/spinner';

export default function EditBankDetailsModal({ bankDetails, editAction, index }) {
  const [modal, setModal] = useState(false);
  const [modifyDetailsSpinner] = useState(false);
  const [bankName, setBankName] = useState(bankDetails.bankName);
  const [accountNumber, setAccountNumber] = useState(bankDetails.accountNumber);
  const [Currency, setCurrency] = useState(bankDetails.Currency);
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState(bankDetails.status);
  const [sendAction, setSendAction] = useState(false);


  const toggle = () => {
    if (sendAction) {
      editAction(
        index,
        {
          ...bankDetails,
          bankName,
          accountNumber,
          Currency,
          status
        }
      );
    }
    setModal(!modal);
    setFeedback('');
  };

  const modifyDetailsTxt = () => {
    if (modifyDetailsSpinner) {
      return (
        <div>
          <p>Please wait ... </p>
          <CommonSpinner />
        </div>
      );
    }

    return 'Modify Bank Details';
  };

  const returnModalFooter = () => (
    <>
      <Button color="secondary" onClick={toggle} className="float-right">Close</Button>
    </>
  );

  const handleModifAccount = (event) => {
    event.preventDefault();
    setSendAction(true);
    setFeedback('Note: your changes will be effected when you submit the entire form.');
  };

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
        <ModalHeader toggle={toggle}>Modify Bank Details</ModalHeader>
        {
          feedback
          && <div className="alert alert-primary" role="alert">
            {feedback}
          </div>
        }
        <ModalBody>
          <div className="row">
            <div className="col">
              {/* Bank name */}
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Bank Name</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Optional"
                    type="text"
                    value={bankName}
                    onChange={(e) => {
                      setFeedback('');
                      setBankName(e.target.value);
                    }}
                  />
                </InputGroup>
              </FormGroup>

              {/* Account Number */}
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Account Number</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Optional"
                    type="text"
                    value={accountNumber}
                    onChange={(e) => {
                      setFeedback('');
                      setAccountNumber(e.target.value);
                    }}
                  />
                </InputGroup>
              </FormGroup>

              {/* Currency */}
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Currency</InputGroupText>
                  </InputGroupAddon>
                  <CustomInput
                    type="select"
                    id="exampleCustomSelect"
                    name="customSelect"
                    value={Currency}
                    onChange={
                      (e) => {
                        setCurrency(e.target.value);
                        setFeedback('');
                      }
                    }
                  >
                    <option value="UGX">UGX</option>
                    <option value="USD">USD</option>
                  </CustomInput>
                </InputGroup>
              </FormGroup>

              {/* Status */}
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Status</InputGroupText>
                  </InputGroupAddon>
                  <CustomInput
                    type="select"
                    id="exampleCustomSelect"
                    name="customSelect"
                    value={status}
                    onChange={
                      (e) => {
                        setStatus(e.target.value);
                      }
                    }
                  >
                    <option value="ARCHIVE">ARCHIVE</option>
                    <option value="ACTIVE">ACTIVE</option>
                  </CustomInput>
                </InputGroup>
              </FormGroup>

              <button className="submitButton" onClick={
                handleModifAccount
              }>{modifyDetailsTxt()}</button>
            </div>
          </div>

          <ModalFooter>
            {returnModalFooter()}
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}


EditBankDetailsModal.propTypes = {
  bankDetails: PropTypes.object,
  editAction: PropTypes.func,
  index: PropTypes.number
};
