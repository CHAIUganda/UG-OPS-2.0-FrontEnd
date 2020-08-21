import React, { useState } from 'react';
import {
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
import PropTypes from 'prop-types';

const AddVendorBankingDetails = ({
  addBankingData,
  modifyBankingData,
  edit,
  bankingData
}) => {
  if (edit && !bankingData) {
    return (
      <div className="alert alert-info" role="alert">
        Sorry! edit is set but bankingData is not.
      </div>
    );
  }

  const [modal, setModal] = useState(false);
  const [formErr, setFormErr] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [bankName, setBankName] = useState(
    edit
      ? bankingData.bankName
      : ''
  );
  const [accountName, setAccountName] = useState(
    edit
      ? bankingData.accountName
      : ''
  );
  const [accountNumber, setAccountNumber] = useState(
    edit
      ? bankingData.accountNumber
      : ''
  );

  const toggle = (event) => {
    event.preventDefault();
    setModal(!modal);
  };

  const reset = () => {
    setBankName('');
    setAccountName('');
    setAccountNumber('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const editDetails = () => {
      const bankDetailsToAdd = {
        bankName,
        accountName,
        accountNumber
      };
      modifyBankingData(bankDetailsToAdd);

      /* reset values */
      setSuccessMessage('Account has been Editted.');
    };

    const addNewDetails = () => {
      const bankDetailsToAdd = {
        bankName,
        accountName,
        accountNumber
      };
      addBankingData(bankDetailsToAdd);

      /* reset values */
      setSuccessMessage('Account has been added.');
      reset();
    };

    if (edit) {
      editDetails();
    } else {
      addNewDetails();
    }
  };

  return (
    <div className="inlineItem ml-5">
      <button onClick={toggle} className="btn btn-outline-primary">
        { edit ? 'Edit' : 'Add Banking Details' }
      </button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Add Vendor Banking Details</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            {
              successMessage && (
                <div className="alert alert-success m-3" role="alert">
                  {successMessage}
                </div>
              )
            }
            {
              formErr && (
                <div className="alert alert-danger m-3" role="alert">
                  {formErr}
                </div>
              )
            }
            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Bank Name</InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="This is the bank name."
                  type="text"
                  value={bankName}
                  onChange={(e) => {
                    setSuccessMessage('');
                    setFormErr('');
                    setBankName(e.target.value);
                  }}
                  required
                />
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Account Name</InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="This is the account name."
                  type="text"
                  value={accountName}
                  onChange={(e) => {
                    setSuccessMessage('');
                    setFormErr('');
                    setAccountName(e.target.value);
                  }}
                  required
                />
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Account Number</InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="This is the account number."
                  type="text"
                  value={accountNumber}
                  onChange={(e) => {
                    setSuccessMessage('');
                    setFormErr('');
                    setAccountNumber(e.target.value);
                  }}
                  required
                />
              </InputGroup>
            </FormGroup>

            <button type="submit" className="btn btn-outline-primary">Add</button>

            {
              successMessage && (
                <div className="alert alert-success m-3" role="alert">
                  {successMessage}
                </div>
              )
            }
            {
              formErr && (
                <div className="alert alert-danger m-3" role="alert">
                  {formErr}
                </div>
              )
            }

          </form>
        </ModalBody>
        <ModalFooter>
          <button onClick={toggle}className="btn btn-outline-secondary">Close</button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

AddVendorBankingDetails.propTypes = {
  addBankingData: PropTypes.func,
  modifyBankingData: PropTypes.func,
  edit: PropTypes.bool,
  bankingData: PropTypes.object
};

export default AddVendorBankingDetails;
