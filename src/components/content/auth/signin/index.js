import React from 'react';
// prettier-ignore
import {
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';

import './signin.css';

export default function SignIn() {
  return (
    <div className="SigninFormStyle">
      <Form>
        <h3 className="signInHeading">Sign In</h3>
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>@ </InputGroupText>
            </InputGroupAddon>
            <Input placeholder="email@clintonhealthaccess.org" />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>****</InputGroupText>
            </InputGroupAddon>
            <Input placeholder="password" />
          </InputGroup>
        </FormGroup>
        <button className="submitButton">Submit</button>
      </Form>
    </div>
  );
}
