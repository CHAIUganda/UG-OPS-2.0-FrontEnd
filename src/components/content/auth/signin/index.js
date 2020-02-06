import React, { useState } from 'react';
// prettier-ignore
import {
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';
import { Link } from 'react-router-dom';

import './signin.css';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    /** hit the API at this point */
  };

  return (
    <div className="SigninFormStyle">
      <Form onSubmit={handleSubmit}>
        <h3 className="signInHeading">Sign In</h3>
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>@ </InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="email@clintonhealthaccess.org"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>***</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
        </FormGroup>
        <button className="submitButton" type="submit">
          Submit
        </button>
      </Form>
      <div className="forgotPassword">
        <p className="cursorClass">Forgot password?</p>
        <Link to="/auth/Register">
          <p className="cursorClass">Register</p>
        </Link>
      </div>
    </div>
  );
}
